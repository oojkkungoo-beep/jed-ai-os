import customtkinter as ctk
from tkinter import ttk, messagebox
from tkcalendar import DateEntry
from utils import to_display, app_font


class RegistrationModule(ctk.CTkFrame):
    def __init__(self, parent, db, app=None):
        super().__init__(parent, corner_radius=0, fg_color="transparent")
        self.db = db
        self.app = app
        self._build()

    def _build(self):
        header = ctk.CTkFrame(self, fg_color="white", corner_radius=8)
        header.pack(fill="x", padx=15, pady=(15, 5))
        ctk.CTkLabel(header, text="📋 บันทึกการรักษา",
                     font=app_font(18, "bold")).pack(side="left", padx=15, pady=10)
        ctk.CTkButton(header, text="+ เพิ่มทะเบียนประวัติ", command=self._open_add,
                      width=150).pack(side="right", padx=10, pady=8)

        search_frame = ctk.CTkFrame(self, fg_color="white", corner_radius=8)
        search_frame.pack(fill="x", padx=15, pady=5)
        ctk.CTkLabel(search_frame, text="ค้นหา:").pack(side="left", padx=10, pady=8)
        self.search_var = ctk.StringVar()
        self.search_var.trace("w", lambda *a: self._load())
        ctk.CTkEntry(search_frame, textvariable=self.search_var, width=320,
                     placeholder_text="ชื่อ, นามสกุล, รหัสพนักงาน, สังกัด").pack(side="left", padx=5)

        table_frame = ctk.CTkFrame(self, fg_color="white", corner_radius=8)
        table_frame.pack(fill="x", padx=15, pady=5)

        cols = ("mn_number", "rank", "name", "department", "phone")
        headers = ("เลขทะเบียน MN", "ยศ", "ชื่อ-นามสกุล", "สังกัด", "โทรศัพท์")
        widths  = (110, 90, 240, 160, 140)

        style = ttk.Style()
        style.theme_use("clam")
        style.configure("Treeview", rowheight=32, font=("TH Sarabun PSK", 14))
        style.configure("Treeview.Heading", font=("TH Sarabun PSK", 14, "bold"),
                        background="#1a5276", foreground="white")
        style.map("Treeview", background=[("selected", "#2980b9")])

        tree_wrap = ctk.CTkFrame(table_frame, fg_color="transparent")
        tree_wrap.pack(fill="both", expand=True, padx=10, pady=10)

        self.tree = ttk.Treeview(tree_wrap, columns=cols, show="headings", selectmode="browse", height=5)
        for col, hdr, w in zip(cols, headers, widths):
            self.tree.heading(col, text=hdr)
            self.tree.column(col, width=w, anchor="center")
        self.tree.column("name", anchor="w")
        self.tree.bind("<Double-1>", self._on_double_click)

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

        self._build_announcements()

        self._load()
        self._load_announcements()

    def _is_admin(self):
        return bool(self.app and self.app.current_user and self.app.current_user.get("role") == "admin")

    def _build_announcements(self):
        board = ctk.CTkFrame(self, fg_color="white", corner_radius=8)
        board.pack(fill="both", expand=True, padx=15, pady=(5, 15))

        header = ctk.CTkFrame(board, fg_color="transparent")
        header.pack(fill="x", padx=15, pady=(10, 5))
        ctk.CTkLabel(header, text="📰 กระดานแจ้งข่าวสาร",
                     font=app_font(15, "bold")).pack(side="left")

        if self._is_admin():
            add_frame = ctk.CTkFrame(board, fg_color="transparent")
            add_frame.pack(fill="x", padx=15, pady=(0, 5))
            self.news_entry = ctk.CTkEntry(add_frame, placeholder_text="พิมพ์ข่าวสาร/ประกาศที่นี่...")
            self.news_entry.pack(side="left", fill="x", expand=True, padx=(0, 8))
            self.news_entry.bind("<Return>", lambda e: self._add_announcement())
            ctk.CTkButton(add_frame, text="+ เพิ่มข่าวสาร", width=110,
                          command=self._add_announcement).pack(side="left")

        self.news_list = ctk.CTkScrollableFrame(board, fg_color="transparent")
        self.news_list.pack(fill="both", expand=True, padx=10, pady=(0, 10))

    def _load_announcements(self):
        for w in self.news_list.winfo_children():
            w.destroy()
        rows = self.db.fetchall("SELECT id, message, created_at FROM announcements ORDER BY id DESC")
        if not rows:
            ctk.CTkLabel(self.news_list, text="ยังไม่มีข่าวสาร", text_color="gray").pack(pady=10)
            return
        for r in rows:
            row = ctk.CTkFrame(self.news_list, fg_color="#f4f6f7", corner_radius=6)
            row.pack(fill="x", pady=3)
            ctk.CTkLabel(row, text=f"{r['message']}", anchor="w",
                         wraplength=700, justify="left").pack(side="left", fill="x", expand=True, padx=10, pady=8)
            ctk.CTkLabel(row, text=to_display(r["created_at"][:10]), text_color="gray",
                         font=app_font(14)).pack(side="left", padx=5)
            if self._is_admin():
                ctk.CTkButton(row, text="ลบ", width=45, fg_color="#e74c3c", hover_color="#c0392b",
                              command=lambda i=r["id"]: self._delete_announcement(i)).pack(side="right", padx=5)

    def _add_announcement(self):
        msg = self.news_entry.get().strip()
        if not msg:
            return
        self.db.execute("INSERT INTO announcements (message) VALUES (?)", (msg,))
        self.news_entry.delete(0, "end")
        self._load_announcements()

    def _delete_announcement(self, ann_id):
        self.db.execute("DELETE FROM announcements WHERE id=?", (ann_id,))
        self._load_announcements()

    def _autoscroll(self, sb, first, last):
        first, last = float(first), float(last)
        if first <= 0 and last >= 1:
            sb.pack_forget()
        else:
            sb.pack(side="right", fill="y")
        sb.set(first, last)

    def _on_double_click(self, event):
        row = self.tree.identify_row(event.y)
        if row:
            emp = self.db.fetchone("SELECT * FROM employees WHERE emp_id=?", (row,))
            if emp and self.app:
                self.app.open_visit_for_employee(dict(emp))

    def _load(self):
        q = self.search_var.get().strip()
        like = f"%{q}%"
        if q:
            rows = self.db.fetchall("""
                SELECT emp_id, mn_number, rank, TRIM(first_name||' '||last_name), department, phone
                FROM employees
                WHERE emp_id LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR department LIKE ?
                ORDER BY created_at DESC
            """, (like, like, like, like))
        else:
            rows = self.db.fetchall("""
                SELECT emp_id, mn_number, rank, TRIM(first_name||' '||last_name), department, phone
                FROM employees ORDER BY created_at DESC
            """)

        self.tree.delete(*self.tree.get_children())
        for r in rows:
            vals = list(r)
            emp_id = vals.pop(0)
            self.tree.insert("", "end", iid=emp_id, values=vals)

    def _selected_id(self):
        sel = self.tree.selection()
        if not sel:
            messagebox.showwarning("แจ้งเตือน", "กรุณาเลือกพนักงานก่อน")
            return None
        return sel[0]

    def _open_add(self):
        EmployeeDialog(self, self.db, None, self._load)

    def _open_edit(self):
        eid = self._selected_id()
        if eid:
            EmployeeDialog(self, self.db, eid, self._load)

    def _delete(self):
        eid = self._selected_id()
        if not eid:
            return
        cnt = self.db.fetchone("SELECT COUNT(*) as c FROM visits WHERE emp_id=?", (eid,))["c"]
        msg = f"ลบพนักงาน '{eid}' ?"
        if cnt:
            msg += f"\n(มีประวัติการรักษา {cnt} ครั้ง จะถูกลบด้วย)"
        if messagebox.askyesno("ยืนยันการลบ", msg):
            self.db.execute("DELETE FROM medicine_dispensed WHERE visit_id IN (SELECT id FROM visits WHERE emp_id=?)", (eid,))
            self.db.execute("DELETE FROM visits WHERE emp_id=?", (eid,))
            self.db.execute("DELETE FROM employees WHERE emp_id=?", (eid,))
            self._load()

    def refresh(self):
        self._load()
        self._load_announcements()


class EmployeeDialog(ctk.CTkToplevel):
    def __init__(self, parent, db, emp_id, on_save):
        super().__init__(parent)
        self.db = db
        self.emp_id = emp_id
        self.on_save = on_save
        self.title("เพิ่มทะเบียนประวัติ" if not emp_id else "แก้ไขทะเบียนประวัติ")
        self.geometry("500x600")
        self.resizable(False, False)
        self.transient(parent.winfo_toplevel())
        self.lift()
        self.focus_force()
        self._build()
        if emp_id:
            self._load()

    def _build(self):
        ctk.CTkLabel(self, text="ข้อมูลทะเบียนประวัติ",
                     font=app_font(17, "bold")).pack(pady=12)

        form = ctk.CTkScrollableFrame(self, fg_color="transparent")
        form.pack(fill="both", expand=True, padx=20)

        ctk.CTkLabel(form, text="เลขทะเบียน MN", anchor="w").pack(fill="x", pady=(8, 0))
        self.mn_field = ctk.CTkEntry(form, state="disabled")
        self.mn_field.pack(fill="x")
        if not self.emp_id:
            self.mn_field.configure(state="normal")
            self.mn_field.insert(0, self.db.next_mn_number())
            self.mn_field.configure(state="disabled")

        self.fields = {}
        defs = [
            ("rank",       "ยศ"),
            ("first_name", "ชื่อ *"),
            ("last_name",  "นามสกุล *"),
            ("department", "สังกัด"),
            ("phone",      "เบอร์โทรศัพท์"),
        ]
        for key, label in defs:
            ctk.CTkLabel(form, text=label, anchor="w").pack(fill="x", pady=(8, 0))
            e = ctk.CTkEntry(form)
            e.pack(fill="x")
            self.fields[key] = e

        ctk.CTkLabel(form, text="วันเกิด", anchor="w").pack(fill="x", pady=(8, 0))
        self.dob_entry = DateEntry(form, date_pattern="dd/mm/yyyy",
                                    font=("TH Sarabun PSK", 14),
                                    background="#1a5276", foreground="white")
        self.dob_entry.pack(fill="x", pady=(2, 0))

        ctk.CTkLabel(form, text="เพศ", anchor="w").pack(fill="x", pady=(8, 0))
        self.gender_var = ctk.StringVar(value="ชาย")
        gf = ctk.CTkFrame(form, fg_color="transparent")
        gf.pack(fill="x")
        for g in ["ชาย", "หญิง", "ไม่ระบุ"]:
            ctk.CTkRadioButton(gf, text=g, variable=self.gender_var, value=g).pack(side="left", padx=10)

        ctk.CTkLabel(form, text="กรุ๊ปเลือด", anchor="w").pack(fill="x", pady=(8, 0))
        self.blood_var = ctk.StringVar(value="ไม่ทราบ")
        ctk.CTkComboBox(form, variable=self.blood_var,
                        values=["ไม่ทราบ", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).pack(fill="x")

        ctk.CTkLabel(form, text="แพ้ยา/สารก่อภูมิแพ้", anchor="w").pack(fill="x", pady=(8, 0))
        self.allergy_box = ctk.CTkTextbox(form, height=55)
        self.allergy_box.pack(fill="x")
        self.allergy_box.insert("1.0", "ไม่มี")

        ctk.CTkLabel(form, text="โรคประจำตัว", anchor="w").pack(fill="x", pady=(8, 0))
        self.disease_box = ctk.CTkTextbox(form, height=55)
        self.disease_box.pack(fill="x")
        self.disease_box.insert("1.0", "ไม่มี")

        bf = ctk.CTkFrame(self, fg_color="transparent")
        bf.pack(fill="x", padx=20, pady=12)
        ctk.CTkButton(bf, text="บันทึก", command=self._save, width=120).pack(side="right", padx=5)
        ctk.CTkButton(bf, text="ยกเลิก", command=self.destroy, width=100,
                      fg_color="gray", hover_color="#555").pack(side="right")

    def _load(self):
        row = self.db.fetchone("SELECT * FROM employees WHERE emp_id=?", (self.emp_id,))
        if not row:
            return
        self.mn_field.configure(state="normal")
        self.mn_field.delete(0, "end")
        self.mn_field.insert(0, row["mn_number"] or "")
        self.mn_field.configure(state="disabled")
        for key in ["rank", "first_name", "last_name", "department", "phone"]:
            e = self.fields[key]
            e.delete(0, "end")
            e.insert(0, row[key] or "")
        if row["dob"]:
            try:
                from datetime import datetime
                self.dob_entry.set_date(datetime.strptime(row["dob"], "%Y-%m-%d").date())
            except ValueError:
                pass
        self.gender_var.set(row["gender"] or "ไม่ระบุ")
        self.blood_var.set(row["blood_type"] or "ไม่ทราบ")
        self.allergy_box.delete("1.0", "end")
        self.allergy_box.insert("1.0", row["allergies"] or "ไม่มี")
        self.disease_box.delete("1.0", "end")
        self.disease_box.insert("1.0", row["underlying_diseases"] or "ไม่มี")

    def _save(self):
        fname = self.fields["first_name"].get().strip()
        lname = self.fields["last_name"].get().strip()
        if not fname or not lname:
            messagebox.showwarning("แจ้งเตือน", "กรุณากรอกข้อมูลที่จำเป็น (*)")
            return
        d = {
            "rank":       self.fields["rank"].get().strip(),
            "first_name": fname,
            "last_name":  lname,
            "department": self.fields["department"].get().strip(),
            "dob":        self.dob_entry.get_date().isoformat(),
            "phone":      self.fields["phone"].get().strip(),
            "gender":     self.gender_var.get(),
            "blood_type": self.blood_var.get(),
            "allergies":  self.allergy_box.get("1.0", "end").strip(),
            "underlying_diseases": self.disease_box.get("1.0", "end").strip(),
        }
        try:
            if self.emp_id:
                self.db.execute("""
                    UPDATE employees SET rank=?,first_name=?,last_name=?,department=?,dob=?,phone=?,
                    gender=?,blood_type=?,allergies=?,underlying_diseases=? WHERE emp_id=?
                """, (d["rank"], d["first_name"], d["last_name"], d["department"], d["dob"], d["phone"],
                      d["gender"], d["blood_type"], d["allergies"], d["underlying_diseases"],
                      self.emp_id))
            else:
                mn = self.mn_field.get().strip()
                self.db.execute("""
                    INSERT INTO employees
                    (emp_id,mn_number,rank,first_name,last_name,department,dob,phone,gender,blood_type,allergies,underlying_diseases)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
                """, (mn, mn, d["rank"], d["first_name"], d["last_name"], d["department"], d["dob"],
                      d["phone"], d["gender"], d["blood_type"], d["allergies"],
                      d["underlying_diseases"]))
        except Exception as exc:
            messagebox.showerror("ผิดพลาด", str(exc))
            return
        self.on_save()
        self.destroy()
