"""
打印相关API路由
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Optional
import asyncio

from app.services.bartender import bartender_service
from app.core.config import settings

router = APIRouter()


class PrintRequest(BaseModel):
    """打印请求模型"""
    template_name: str
    data_sources: Dict[str, str]
    username: Optional[str] = "system"
    output_filename: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "template_name": "test",
                "username": "operator01",
                "data_sources": {
                    "ProductName": "智能手机",
                    "SerialNumber": "SN20241212001",
                    "Date": "2024-12-12",
                    "QC_Inspector": "张三"
                }
            }
        }


class PrintResponse(BaseModel):
    """打印响应模型"""
    success: bool
    message: str
    filename: Optional[str] = None
    file_path: Optional[str] = None
    download_url: Optional[str] = None
    error: Optional[str] = None


@router.post("/print", response_model=PrintResponse)
async def print_label(request: PrintRequest):
    """
    打印标签
    
    接收模板名和数据源，执行BarTender打印并保存为PDF
    """
    try:
        # 执行打印
        result = await bartender_service.print_to_pdf(
            template_name=request.template_name,
            data_sources=request.data_sources,
            username=request.username
        )
        
        if result['success']:
            return PrintResponse(
                success=True,
                message=result['message'],
                filename=result['filename'],
                file_path=result['file_path'],
                download_url=result.get('download_url')
            )
        else:
            raise HTTPException(
                status_code=400,
                detail=f"打印失败: {result.get('error')}"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"打印服务异常: {str(e)}"
        )


@router.get("/files")
async def list_files():
    """
    列出所有已打印的文件
    """
    try:
        files = bartender_service.list_files()
        return {
            "success": True,
            "count": len(files),
            "files": files
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"获取文件列表失败: {str(e)}"
        )


@router.get("/status/{filename}")
async def get_file_status(filename: str):
    """
    获取文件状态信息
    """
    try:
        file_info = bartender_service.get_file_info(filename)
        
        if file_info:
            return {
                "exists": True,
                **file_info
            }
        else:
            return {
                "exists": False,
                "filename": filename,
                "message": "文件不存在"
            }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"获取文件状态失败: {str(e)}"
        )
