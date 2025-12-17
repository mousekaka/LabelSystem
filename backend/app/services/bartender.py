"""
BarTender打印服务
重构自验证代码，优化结构和错误处理
"""
import os
import tempfile
import subprocess
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional
import asyncio

import pyautogui
from loguru import logger

from app.core.config import settings


class BartenderPrintService:
    """BarTender打印服务封装"""
    
    def __init__(self):
        self.bartender_exe = Path(settings.BARTENDER_EXE)
        self.output_dir = Path(settings.OUTPUT_DIR)
        self.templates_dir = Path(settings.TEMPLATES_DIR)
        
        # 确保目录存在
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.templates_dir.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"BarTender服务初始化完成")
        logger.info(f"模板目录: {self.templates_dir}")
        logger.info(f"输出目录: {self.output_dir}")
    
    def _generate_filename(self, username: str, template_name: str) -> str:
        """生成唯一文件名
        
        格式: {用户名}_{模板名}_{时间戳}.pdf
        示例: operator01_product_label_20241212_143022.pdf
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_username = "".join(c for c in username if c.isalnum() or c in "_-")
        safe_template = "".join(c for c in template_name if c.isalnum() or c in "_-")
        
        return f"{safe_username}_{safe_template}_{timestamp}.pdf"
    
    def _create_print_xml(self, template_path: Path, data_sources: Dict[str, str]) -> str:
        """创建BarTender XML打印脚本"""
        xml_lines = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<XMLScript Version="2.0">',
            '  <Command>',
            '    <Print>',
            f'      <Format>{template_path}</Format>'
        ]
        
        # 添加数据源
        for name, value in data_sources.items():
            # 对XML特殊字符进行转义
            safe_value = str(value).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            xml_lines.extend([
                f'      <NamedSubString Name="{name}">',
                f'        <Value>{safe_value}</Value>',
                '      </NamedSubString>'
            ])
        
        # 打印机配置
        xml_lines.extend([
            '      <PrintSetup>',
            '        <Printer>Microsoft Print to PDF</Printer>',
            '        <IdenticalCopiesOfLabel>1</IdenticalCopiesOfLabel>',
            '      </PrintSetup>',
            '    </Print>',
            '  </Command>',
            '</XMLScript>'
        ])
        
        return '\n'.join(xml_lines)
    
    def _auto_save_with_double_enter(self, save_path: Path) -> bool:
        """双回车自动化保存机制
        
        参数:
            save_path: 保存文件的完整路径
        
        返回:
            bool: 操作是否成功
        """
        try:
            logger.info("等待保存对话框出现...")
            time.sleep(4)  # 等待对话框
            
            logger.info(f"输入保存路径: {save_path}")
            pyautogui.write(str(save_path))
            time.sleep(0.5)
            
            logger.info("第一次回车（确认输入）...")
            pyautogui.press('enter')
            time.sleep(0.5)
            
            logger.info("第二次回车（触发保存）...")
            pyautogui.press('enter')
            
            logger.info("等待保存操作完成...")
            time.sleep(3)
            
            return True
            
        except Exception as e:
            logger.error(f"自动保存失败: {e}")
            return False
    
    async def print_to_pdf(self, template_name: str, data_sources: Dict[str, str], 
                          username: str = "system") -> Dict:
        """执行打印任务
        
        参数:
            template_name: 模板文件名（不含.btw扩展名）
            data_sources: 数据源字典
            username: 用户名，用于生成文件名
        
        返回:
            Dict: 包含执行结果的字典
        """
        logger.info(f"开始打印任务 - 模板: {template_name}, 用户: {username}")
        
        try:
            # 1. 验证模板文件
            template_path = self.templates_dir / f"{template_name}.btw"
            if not template_path.exists():
                error_msg = f"模板文件不存在: {template_name}.btw"
                logger.error(error_msg)
                return {
                    'success': False,
                    'error': error_msg,
                    'template': template_name
                }
            
            # 2. 生成输出文件名和路径
            filename = self._generate_filename(username, template_name)
            save_path = self.output_dir / filename
            
            # 3. 创建XML脚本
            xml_content = self._create_print_xml(template_path, data_sources)
            logger.debug(f"生成的XML长度: {len(xml_content)} 字符")
            
            # 4. 保存XML到临时文件
            temp_xml = None
            try:
                # 使用tempfile创建临时文件
                with tempfile.NamedTemporaryFile(
                    mode='w', 
                    suffix='.xml', 
                    encoding='utf-8', 
                    delete=False
                ) as f:
                    f.write(xml_content)
                    temp_xml = f.name
                
                logger.debug(f"临时XML文件: {temp_xml}")
                
                # 5. 执行BarTender
                cmd = f'"{self.bartender_exe}" /XMLScript="{temp_xml}"'
                logger.info(f"执行命令: {cmd}")
                
                # 在子进程中执行
                process = subprocess.Popen(
                    cmd,
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
                
                # 6. 自动保存
                auto_save_success = self._auto_save_with_double_enter(save_path)
                
                # 7. 等待进程结束
                try:
                    stdout, stderr = process.communicate(timeout=10)
                    if stdout:
                        logger.debug(f"BarTender输出: {stdout.decode('utf-8', errors='ignore')}")
                    if stderr:
                        logger.warning(f"BarTender错误: {stderr.decode('utf-8', errors='ignore')}")
                except subprocess.TimeoutExpired:
                    logger.warning("BarTender进程超时，强制终止")
                    process.kill()
                    stdout, stderr = process.communicate()
                
                # 8. 检查文件是否生成
                file_generated = save_path.exists() and save_path.stat().st_size > 0
                
                if auto_save_success and file_generated:
                    file_size = save_path.stat().st_size
                    logger.success(f"打印成功: {filename} ({file_size} 字节)")
                    
                    return {
                        'success': True,
                        'filename': filename,
                        'file_path': str(save_path),
                        'file_size': file_size,
                        'download_url': f"/api/v1/files/{filename}",
                        'message': '打印任务执行完成'
                    }
                else:
                    error_msg = "文件生成失败或自动保存未完成"
                    logger.error(error_msg)
                    return {
                        'success': False,
                        'error': error_msg,
                        'template': template_name
                    }
                    
            finally:
                # 清理临时文件
                if temp_xml and os.path.exists(temp_xml):
                    try:
                        os.unlink(temp_xml)
                        logger.debug("清理临时XML文件")
                    except Exception as e:
                        logger.warning(f"清理临时文件失败: {e}")
                        
        except Exception as e:
            logger.error(f"打印任务异常: {e}")
            return {
                'success': False,
                'error': str(e),
                'template': template_name
            }
    
    def get_file_info(self, filename: str) -> Optional[Dict]:
        """获取文件信息"""
        file_path = self.output_dir / filename
        
        if file_path.exists():
            try:
                stat = file_path.stat()
                return {
                    'filename': filename,
                    'file_path': str(file_path),
                    'size_bytes': stat.st_size,
                    'created_at': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                    'modified_at': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    'download_url': f"/api/v1/files/{filename}"
                }
            except Exception as e:
                logger.error(f"获取文件信息失败 {filename}: {e}")
                return None
        
        return None
    
    def list_files(self) -> list:
        """列出所有PDF文件"""
        files = []
        for file_path in self.output_dir.glob("*.pdf"):
            file_info = self.get_file_info(file_path.name)
            if file_info:
                files.append(file_info)
        
        # 按创建时间倒序排序
        files.sort(key=lambda x: x['created_at'], reverse=True)
        return files


# 创建全局服务实例
bartender_service = BartenderPrintService()
