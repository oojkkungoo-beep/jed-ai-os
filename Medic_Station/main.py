import customtkinter as ctk
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import Database
from modules.registration import RegistrationModule
from modules.visit import VisitModule
from modules.medicine import MedicineModule
from modules.report import ReportModule
from utils import app_font, FONT_FAMILY

ctk.set_appearance_mode("light")
ctk.set_default_color_theme("blue")
ctk.ThemeManager.theme["CTkFont"]["family"] = FONT_FAMILY
ctk.ThemeManager.theme["CTkFont"]["size"] = 14


class MedicStationApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("MED-App — ระบบห้องพยาบาล")
        self.geometry("1350x750")
        self.minsize(1100, 620)

        self.db = Database()
        self.current = None
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

        self.content = ctk.CTkFrame(self, corner_radius=0, fg_color="#f0f3f4")
        self.content.pack(side="right", fill="both", expand=True)

        self.modules = {
            "registration": RegistrationModule(self.content, self.db, app=self),
            "visit":        VisitModule(self.content, self.db, app=self),
            "medicine":     MedicineModule(self.content, self.db),
            "report":       ReportModule(self.content, self.db),
        }

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

    def on_close(self):
        self.db.close()
        self.destroy()


if __name__ == "__main__":
    app = MedicStationApp()
    app.protocol("WM_DELETE_WINDOW", app.on_close)
    app.mainloop()
