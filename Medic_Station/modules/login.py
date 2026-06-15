import customtkinter as ctk
from utils import app_font


class LoginWindow(ctk.CTkToplevel):
    def __init__(self, parent, db):
        super().__init__(parent)
        self.db = db
        self.result = None

        self.title("เข้าสู่ระบบ — MED-App")
        self.geometry("380x380")
        self.resizable(False, False)
        self.protocol("WM_DELETE_WINDOW", self._cancel)

        frame = ctk.CTkFrame(self, fg_color="white", corner_radius=10)
        frame.pack(fill="both", expand=True, padx=20, pady=20)

        ctk.CTkLabel(frame, text="🏥 MED-App",
                     font=app_font(22, "bold")).pack(pady=(30, 4))
        ctk.CTkLabel(frame, text="ระบบห้องพยาบาล — เข้าสู่ระบบ",
                     font=app_font(14), text_color="#7f8c8d").pack(pady=(0, 20))

        ctk.CTkLabel(frame, text="ชื่อผู้ใช้", anchor="w").pack(fill="x", padx=30)
        self.username = ctk.CTkEntry(frame)
        self.username.pack(fill="x", padx=30, pady=(2, 10))

        ctk.CTkLabel(frame, text="รหัสผ่าน", anchor="w").pack(fill="x", padx=30)
        self.password = ctk.CTkEntry(frame, show="*")
        self.password.pack(fill="x", padx=30, pady=(2, 4))
        self.password.bind("<Return>", lambda e: self._login())

        self.error_label = ctk.CTkLabel(frame, text="", text_color="#c0392b")
        self.error_label.pack(pady=(4, 4))

        ctk.CTkButton(frame, text="เข้าสู่ระบบ", command=self._login,
                      height=38).pack(fill="x", padx=30, pady=(10, 10))

        self.username.focus_set()
        self.transient(parent)
        self.grab_set()
        self.lift()
        self.focus_force()

    def _login(self):
        u = self.username.get().strip()
        p = self.password.get()
        if not u or not p:
            self.error_label.configure(text="กรุณากรอกชื่อผู้ใช้และรหัสผ่าน")
            return

        row = self.db.fetchone(
            "SELECT * FROM users WHERE username=? AND password=?", (u, p))
        if not row:
            self.error_label.configure(text="ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
            self.password.delete(0, "end")
            return

        self.result = {
            "username": row["username"],
            "display_name": row["display_name"] or row["username"],
            "role": row["role"],
        }
        self.grab_release()
        self.destroy()

    def _cancel(self):
        self.result = None
        self.grab_release()
        self.destroy()
