"""
FastAPI应用入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
# 导入API路由
from app.api import print as print_api


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    应用生命周期管理
    
    yield之前：应用启动时执行
    yield之后：应用关闭时执行
    """
    # 应用启动
    print(f"🚀 启动 {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"🌐 访问地址: http://{settings.HOST}:{settings.PORT}")
    print(f"📚 API文档: http://{settings.HOST}:{settings.PORT}/docs")
    
    # 初始化服务（例如数据库连接）
    # TODO: 初始化数据库连接池
    
    yield
    
    # 应用关闭
    print(f"🛑 关闭 {settings.APP_NAME}")
    # TODO: 清理资源（关闭数据库连接等）


# 创建FastAPI应用
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """根路径"""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "api": settings.API_V1_STR,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """健康检查端点"""
    from datetime import datetime
    return {
        "status": "healthy",
        "service": "bartender_print",
        "timestamp": datetime.now().isoformat()
    }


@app.get(f"{settings.API_V1_STR}/info")
async def api_info():
    """API信息"""
    return {
        "version": settings.APP_VERSION,
        "endpoints": [
            f"GET  {settings.API_V1_STR}/info - API信息",
            f"POST {settings.API_V1_STR}/print - 打印标签",
            f"GET  {settings.API_V1_STR}/files - 文件列表",
            f"GET  {settings.API_V1_STR}/status/{{filename}} - 文件状态",
        ]
    }


# 注册打印API路由
app.include_router(print_api.router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        log_level="info"
    )
