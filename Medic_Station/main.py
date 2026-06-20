import customtkinter as ctk
import sys
import os
import traceback
from tkinter import messagebox

if sys.platform == "win32":
    try:
        import ctypes
        ctypes.windll.shcore.SetProcessDpiAwareness(1)
    except Exception:
        pass

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import Database
from modules.registration import RegistrationModule
from modules.visit import VisitModule
from modules.medicine import MedicineModule
from modules.report import ReportModule
from modules.users import UserManagementModule
from modules.login import LoginWindow
from constants import USER_ROLE_LABELS
from utils import app_font, FONT_FAMILY

ctk.set_appearance_mode("light")
ctk.set_default_color_theme("blue")
ctk.ThemeManager.theme["CTkFont"]["family"] = FONT_FAMILY
ctk.ThemeManager.theme["CTkFont"]["size"] = 14

CRASH_LOG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "crash_log.txt")


def log_crash(exc_type, exc_value, exc_tb):
    """บันทึก traceback ลง crash_log.txt และแจ้งเตือนผู้ใช้ จะได้ไม่หายไปเงียบๆ"""
    msg = "".join(traceback.format_exception(exc_type, exc_value, exc_tb))
    with open(CRASH_LOG, "a", encoding="utf-8") as f:
        f.write(msg + "\n" + "=" * 60 + "\n")
    try:
        messagebox.showerror("เกิดข้อผิดพลาด",
                              f"{exc_value}\n\nรายละเอียดถูกบันทึกไว้ใน crash_log.txt")
    except Exception:
        pass


sys.excepthook = log_crash


class MedicStationApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("MED-App — ระบบห้องพยาบาล")
        win_w, win_h = 1350, 750
        self.geometry(f"{win_w}x{win_h}+0+0")
        self.minsize(1100, 620)

        self.db = Database()
        self.current = None
        self.current_user = None

        self.withdraw()
        login = LoginWindow(self, self.db)
        self.wait_window(login)
        if not login.result:
            self.db.close()
            self.destroy()
            return
        self.current_user = login.result
        self.deiconify()
        # customtkinter ยังคิดว่าหน้าต่างยังไม่เคย "exist" (เพราะ login ใช้ wait_window
        # ไม่ใช่ update/mainloop) ถ้าไม่เคลียร์ flag นี้ก่อน mainloop() จะรัน
        # _windows_set_titlebar_color ซึ่ง withdraw() หน้าต่างแล้วไม่ deiconify กลับ
        self.update()

        self._build()
        self.show("registration")

    def _build(self):
        self.sidebar = ctk.CTkFrame(self, width=210, corner_radius=0,
                                    fg_color=("#1a5276", "#1a5276"))
        self.sidebar.pack(side="left", fill="y")
        self.sidebar.pack_propagate(False)

        ctk.CTkLabel(self.sidebar, text="🏥 MED-App",
                     font=app_font(24, "bold"),
                     text_color="white").pack(pady=(25, 4))
        ctk.CTkLabel(self.sidebar, text="ระบบห้องพยาบาล",
                     font=app_font(14), text_color="#aed6f1").pack(pady=(0, 20))

        nav = [
            ("📋  บันทึกการรักษา",      "registration"),
            ("💊  คลังยา",             "medicine"),
            ("📊  รายงาน",             "report"),
        ]
        if self.current_user["role"] == "admin":
            nav.append(("👥  จัดการผู้ใช้", "users"))

        self.nav_btns = {}
        for label, key in nav:
            btn = ctk.CTkButton(
                self.sidebar, text=label,
                command=lambda k=key: self.show(k),
                fg_color="transparent", hover_color="#2980b9",
                text_color="white", anchor="w",
                height=46, font=app_font(15), corner_radius=0)
            btn.pack(fill="x", pady=1)
            self.nav_btns[key] = btn

        user_bar = ctk.CTkFrame(self.sidebar, fg_color="#154360", corner_radius=0)
        user_bar.pack(side="bottom", fill="x")
        role_label = USER_ROLE_LABELS.get(self.current_user["role"], self.current_user["role"])
        ctk.CTkLabel(user_bar, text=f"👤 {self.current_user['display_name']} ({role_label})",
                     text_color="white", font=app_font(13),
                     wraplength=190, justify="left").pack(fill="x", padx=12, pady=(10, 4))
        ctk.CTkButton(user_bar, text="ออกจากระบบ", command=self.logout,
                      fg_color="#922b21", hover_color="#641e16",
                      height=34, font=app_font(13)).pack(fill="x", padx=12, pady=(0, 12))

        self.content = ctk.CTkFrame(self, corner_radius=0, fg_color="#f0f3f4")
        self.content.pack(side="right", fill="both", expand=True)

        self.modules = {
            "registration": RegistrationModule(self.content, self.db, app=self),
            "visit":        VisitModule(self.content, self.db, app=self),
            "medicine":     MedicineModule(self.content, self.db),
            "report":       ReportModule(self.content, self.db, app=self),
        }
        if self.current_user["role"] == "admin":
            self.modules["users"] = UserManagementModule(self.content, self.db, app=self)

    def open_visit_for_employee(self, emp):
        self.modules["visit"].open_for_employee(emp)
        self.show("visit")

    def show(self, key):
        if self.current:
            self.modules[self.current].pack_forget()
        self.current = key
        self.modules[key].pack(fill="both", expand=True)
        self.modules[key].refresh()
        for k, btn in self.nav_btns.items():
            btn.configure(fg_color="#2980b9" if k == key else "transparent")

    def logout(self):
        self.db.close()
        self.destroy()
        os.execv(sys.executable, [sys.executable] + sys.argv)

    def on_close(self):
        self.db.close()
        self.destroy()

    def report_callback_exception(self, exc_type, exc_value, exc_tb):
        log_crash(exc_type, exc_value, exc_tb)


if __name__ == "__main__":
    try:
        app = MedicStationApp()
        if app.current_user:
            app.protocol("WM_DELETE_WINDOW", app.on_close)
            app.mainloop()
    except Exception:
        log_crash(*sys.exc_info())
