import subprocess
import webbrowser
import time
import os
import socket

def is_port_open(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def main():
    port = 8080
    
    # If the port is not open, the server is not running, so we start it.
    if not is_port_open(port):
        # Locate the backend directory and python binaries
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
        # If we are compiled in onefile mode, base_dir might be a temp extraction path, 
        # so we check standard project locations.
        possible_dirs = [
            r"C:\Users\Administrator\Documents\crop-disease-diagnosis\backend",
            os.path.join(base_dir, "backend"),
            base_dir
        ]
        
        backend_dir = None
        for d in possible_dirs:
            if os.path.exists(os.path.join(d, "app.py")):
                backend_dir = d
                break
                
        if backend_dir:
            py_exe = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
            app_py = os.path.join(backend_dir, "app.py")
            
            if os.path.exists(py_exe) and os.path.exists(app_py):
                # Spawn Flask backend silently in the background (no window)
                # 0x08000000 is CREATE_NO_WINDOW on Windows systems
                subprocess.Popen(
                    [py_exe, app_py],
                    cwd=backend_dir,
                    creationflags=0x08000000
                )
                # Wait for Flask web server socket to bind
                time.sleep(3.0)

    # Open the website link
    webbrowser.open(f"http://127.0.0.1:{port}")

if __name__ == "__main__":
    main()
