' รัน MED-App แบบไม่มีหน้าต่าง console ค้างให้เห็น
Set objShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
objShell.CurrentDirectory = strPath
objShell.Run "pythonw main.py", 0, False
