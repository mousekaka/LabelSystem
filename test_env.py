import sys
import win32com.client
import pythoncom

def test_environment():
    print("=== 环境测试 ===")
    
    # Python版本
    print(f"Python版本: {sys.version}")
    
    # 测试Bartender COM连接
    try:
        pythoncom.CoInitialize()
        bt_app = win32com.client.Dispatch("Bartender.Application")
        bt_app.Visible = False
        print("✅ Bartender COM接口连接成功")
        bt_app.Quit()
    except Exception as e:
        print(f"❌ Bartender连接失败: {e}")
    finally:
        pythoncom.CoUninitialize()
    
    print("环境测试完成")

if __name__ == "__main__":
    test_environment()
