import customtkinter as ctk
from tkinter import ttk, messagebox
from constants import USER_ROLES, USER_ROLE_LABELS
from utils import app_font


class UserManagementModule(ctk.CTkFrame):
    def __init__(self, parent, db, app=None):
        super().__init__(parent, corner_radius=0, fg_color="transparent")
        self.db = db
        self.app = app
        self._build()

    def _build(self):
        header = ctk.CTkFrame(self, fg_color="white", corner_radius=8)
        header.pack(fill="x", padx=15, pady=(15, 5))
        ctk.CTkLabel(header, text="👥 จัดการผู้ใช้",
                     font=app_font(18, "bold")).pack(side="left", padx=15, pady=10)
        ctk.CTkButton(header, text="+ เพิ่มผู้ใช้", command=self._open_add,
                      width=130).pack(side="right", padx=10, pady=8)

        table_frame = ctk.CTkFrame(self, fg_color="white", corner_radius=8)
        table_frame.pack(fill="both", expand=True, padx=15, pady=5)

        cols = ("username", "display_name", "role")
        headers = ("ชื่อผู้ใช้", "ชื่อที่แสดง", "สิทธิ์")
        widths = (160, 240, 140)

        style = ttk.Style()
        style.theme_use("clam")
        style.configure("Treeview", rowheight=32, font=("TH Sarabun PSK", 14))
        style.configure("Treeview.Heading", font=("TH Sarabun PSK", 14, "bold"),
                        background="#1a5276", foreground="white")
        style.map("Treeview", background=[("selected", "#2980b9")])

        tree_wrap = ctk.CTkFrame(table_frame, fg_color="transparent")
        tree_wrap.pack(fill="both", expand=True, padx=10, pady=10)

        self.tree = ttk.Treeview(tree_wrap, columns=cols, show="headings", selectmode="browse", height=12)
        for col, hdr, w in zip(cols, headers, widths):
            self.tree.heading(col, text=hdr)
            self.tree.column(col, width=w, anchor="center")
        self.tree.column("display_name", anchor="w")

        sb = ttk.Scrollbar(tree_wrap, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=lambda f, l: self._autoscroll(sb, f, l))
        self.tree.pack(side="left", fill="both", expand=True)
        sb.pack(side="right", fill="y")

        action = ctk.CTkFrame(table_frame, fg_color="transparent")
        action.pack(fill="x", padx=10, pady=(0, 10))
        ctk.CTkButton(action, text="✏️ แก้ไข", command=self._open_edit,
                      width=100, fg_color="#2980b9").pack(side="left", padx=5)
        ctk.CTkButton(action, text="🗑️ ลบ", command=self._delete,
                      width=100, fg_color="#e74c3c", hover_color="#c0392b").pack(side="left", padx=5)

        self._load()

    def _autoscroll(self, sb, first, last):
        first, last = float(first), float(last)
        if first <= 0 and last >= 1:
            sb.pack_forget()
        else:
            sb.pack(side="right", fill="y")
        sb.set(first, last)

    def _load(self):
        rows = self.db.fetchall("SELECT username, display_name, role FROM users ORDER BY username")
        self.tree.delete(*self.tree.get_children())
        for r in rows:
            self.tree.insert("", "end", iid=r["username"],
                             values=(r["username"], r["display_name"], USER_ROLE_LABELS.get(r["role"], r["role"])))

    def _selected_username(self):
        sel = self.tree.selection()
        if not sel:
            messagebox.showwarning("แจ้งเตือน", "กรุณาเลือกผู้ใช้ก่อน")
            return None
        return sel[0]

    def _open_add(self):
        UserDialog(self, self.db, None, self._load)

    def _open_edit(self):
        username = self._selected_username()
        if username:
            UserDialog(self, self.db, username, self._load)

    def _admin_count(self, exclude_username=None):
        rows = self.db.fetchall("SELECT username FROM users WHERE role='admin'")
        return len([r for r in rows if r["username"] != exclude_username])

    def _delete(self):
        username = self._selected_username()
        if not username:
            return
        row = self.db.fetchone("SELECT role FROM users WHERE username=?", (username,))
        if row["role"] == "admin" and self._admin_count(exclude_username=username) == 0:
            messagebox.showwarning("แจ้งเตือน", "ต้องมีผู้ดูแลระบบ (admin) เหลืออยู่อย่างน้อย 1 คน")
            return
        if messagebox.askyesno("ยืนยันการลบ", f"ลบผู้ใช้ '{username}' ?"):
            self.db.execute("DELETE FROM users WHERE username=?", (username,))
            self._load()

    def refresh(self):
        self._load()


class UserDialog(ctk.CTkToplevel):
    def __init__(self, parent, db, username, on_save):
        super().__init__(parent)
        self.db = db
        self.username = username
        self.on_save = on_save
        self.title("เพิ่มผู้ใช้" if not username else "แก้ไขผู้ใช้")
        self.geometry("400x380")
        self.resizable(False, False)
        self.transient(parent.winfo_toplevel())
        self.lift()
        self.focus_force()
        self._build()
        if username:
            self._load()

    def _build(self):
        form = ctk.CTkFrame(self, fg_color="transparent")
        form.pack(fill="both", expand=True, padx=20, pady=15)

        ctk.CTkLabel(form, text="ชื่อผู้ใช้ (username) *", anchor="w").pack(fill="x", pady=(8, 0))
        self.username_entry = ctk.CTkEntry(form)
        self.username_entry.pack(fill="x")
        if self.username:
            self.username_entry.insert(0, self.username)
            self.username_entry.configure(state="disabled")

        ctk.CTkLabel(form, text="ชื่อที่แสดง *", anchor="w").pack(fill="x", pady=(8, 0))
        self.display_name_entry = ctk.CTkEntry(form)
        self.display_name_entry.pack(fill="x")

        ctk.CTkLabel(form, text="รหัสผ่าน *", anchor="w").pack(fill="x", pady=(8, 0))
        self.password_entry = ctk.CTkEntry(form)
        self.password_entry.pack(fill="x")

        ctk.CTkLabel(form, text="สิทธิ์", anchor="w").pack(fill="x", pady=(8, 0))
        self.role_var = ctk.StringVar(value=USER_ROLE_LABELS["user"])
        ctk.CTkOptionMenu(form, variable=self.role_var,
                          values=[label for _, label in USER_ROLES]).pack(fill="x")

        bf = ctk.CTkFrame(self, fg_color="transparent")
        bf.pack(fill="x", padx=20, pady=12)
        ctk.CTkButton(bf, text="บันทึก", command=self._save, width=120).pack(side="right", padx=5)
        ctk.CTkButton(bf, text="ยกเลิก", command=self.destroy, width=100,
                      fg_color="gray", hover_color="#555").pack(side="right")

    def _load(self):
        row = self.db.fetchone("SELECT * FROM users WHERE username=?", (self.username,))
        if not row:
            return
        self.display_name_entry.insert(0, row["display_name"] or "")
        self.password_entry.insert(0, row["password"] or "")
        self.role_var.set(USER_ROLE_LABELS.get(row["role"], USER_ROLE_LABELS["user"]))

    def _save(self):
        username = self.username or self.username_entry.get().strip()
        display_name = self.display_name_entry.get().strip()
        password = self.password_entry.get().strip()
        role_label = self.role_var.get()
        role = next((code for code, label in USER_ROLES if label == role_label), "user")

        if not username or not display_name or not password:
            messagebox.showwarning("แจ้งเตือน", "กรุณากรอกข้อมูลที่จำเป็น (*)")
            return

        if self.username and role != "admin":
            current = self.db.fetchone("SELECT role FROM users WHERE username=?", (self.username,))
            if current["role"] == "admin":
                others = self.db.fetchall("SELECT username FROM users WHERE role='admin' AND username != ?", (self.username,))
                if not others:
                    messagebox.showwarning("แจ้งเตือน", "ต้องมีผู้ดูแลระบบ (admin) เหลืออยู่อย่างน้อย 1 คน")
                    return

        try:
            if self.username:
                self.db.execute(
                    "UPDATE users SET display_name=?, password=?, role=? WHERE username=?",
                    (display_name, password, role, self.username))
            else:
                self.db.execute(
                    "INSERT INTO users (username, password, display_name, role) VALUES (?,?,?,?)",
                    (username, password, display_name, role))
        except Exception as exc:
            messagebox.showerror("ผิดพลาด", str(exc))
            return
        self.on_save()
        self.destroy()
