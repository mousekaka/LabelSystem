from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """应用配置"""
    
    # 应用信息
    APP_NAME: str = "标签打印系统"
    APP_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # 服务器配置
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    
    # 数据库配置
    DATABASE_URL: Optional[str] = None
    
    # BarTender配置
    BARTENDER_EXE: str = r"C:\Program Files\Seagull\BarTender Suite\bartend.exe"
    TEMPLATES_DIR: str = r"D:\Projects\LabelSystem\backend\app\templates"
    OUTPUT_DIR: str = r"D:\server_print_output"
    
    # 安全配置
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS配置
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:8080"]
    
    # Redis配置
    REDIS_URL: Optional[str] = "redis://localhost:6379"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# 创建全局配置实例
settings = Settings()