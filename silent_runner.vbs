Set oShell = CreateObject("WScript.Shell")
oShell.Run "cmd /c cd /d ""D:\Claude_Cowork\Jed_org"" && python -m http.server 3334 --bind 127.0.0.1", 0, False
