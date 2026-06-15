' สร้าง shortcut "MED-App" บน Desktop ของเครื่องนี้ (รันครั้งเดียวตอนติดตั้ง)
Set objShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
strDesktop = objShell.SpecialFolders("Desktop")

Set link = objShell.CreateShortcut(strDesktop & "\MED-App.lnk")
link.TargetPath = strPath & "\run_silent.vbs"
link.WorkingDirectory = strPath
link.IconLocation = strPath & "\med_app.ico"
link.Description = "MED-App - ระบบห้องพยาบาล"
link.Save
