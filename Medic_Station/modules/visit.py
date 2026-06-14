import customtkinter as ctk
from tkinter import ttk, messagebox
from datetime import date, datetime
from tkcalendar import DateEntry
from utils import to_display, app_font
from constants import DISEASE_SYSTEMS, DISEASE_SYSTEM_LABELS


class VisitModule(ctk.CTkFrame):
    def __init__(self, parent, db, app=None):
        super().__init__(parent, corner_radius=0, fg_color="transparent")
        self.db = db
        self.app = app
        self.selected_emp = None
        self._build()

    def _build(self):
        header = ctk.CTkFrame(self, fg_color="white", corner_radius=8)
        header.pack(fill="x", padx=15, pady=(15, 5))
        if self.app:
            ctk.CTkButton(header, text="← กลับ", command=lambda: self.app.show("registration"),
                          width=80, fg_color="gray").pack(side="left", padx=(10, 5), pady=10)
        ctk.CTkLabel(header, text="📋 บันทึกการรักษา",
                     font=app_font(18, "bold")).pack(side="left", padx=5, pady=10)
        ctk.CTkButton(header, text="+ บันทึกการรักษา", command=self._open_add,
                      width=150).pack(side="right", padx=10, pady=8)

        self.emp_bar = ctk.CTkFrame(self, fg_color="#eaf2ff", corner_radius=8)
        self.emp_bar.pack(fill="x", padx=15, pady=5)
        self.emp_placeholder = ctk.CTkLabel(self.emp_bar, text="ยังไม่ได้เลือกพนักงาน",
                                             text_color="gray", font=app_font(16))
        self.emp_placeholder.pack(padx=15, pady=14)

        tf = ctk.CTkFrame(self, fg_color="white", corner_radius=8)
        tf.pack(fill="both", expand=True, padx=15, pady=(5, 15))
        ctk.CTkLabel(tf, text="ประวัติการรักษา",
                     font=app_font(15, "bold")).pack(anchor="w", padx=15, pady=(10, 5))

        cols    = ("visit_date", "chief_complaint", "diagnosis", "treatment", "notes", "caregiver")
        headers = ("วันที่",     "อาการ",            "การวินิจฉัย", "การรักษา", "หมายเหตุ", "ผู้ให้การรักษา")
        widths  = (100, 220, 220, 220, 200, 130)

        wrap = ctk.CTkFrame(tf, fg_color="transparent")
        wrap.pack(fill="both", expand=True, padx=10, pady=(0, 5))

        self.tree = ttk.Treeview(wrap, columns=cols, show="headings")
        for col, hdr, w in zip(cols, headers, widths):
            self.tree.heading(col, text=hdr)
            self.tree.column(col, width=w)
        self.tree.bind("<Double-1>", self._on_double_click)

        self._sb = ttk.Scrollbar(wrap, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=lambda f, l: self._autoscroll(self._sb, f, l))
        self.tree.pack(side="left", fill="both", expand=True)
        self._sb.pack(side="right", fill="y")

        af = ctk.CTkFrame(tf, fg_color="transparent")
        af.pack(fill="x", padx=10, pady=(0, 10))
        ctk.CTkButton(af, text="🔍 ดูรายละเอียด", command=self._open_view,
                      width=130, fg_color="#2980b9").pack(side="left", padx=5)
        ctk.CTkButton(af, text="✏️ แก้ไข", command=self._open_edit_visit,
                      width=100, fg_color="#e67e22", hover_color="#ca6f1e").pack(side="left", padx=5)
        ctk.CTkButton(af, text="🗑️ ลบ", command=self._delete,
                      width=100, fg_color="#e74c3c", hover_color="#c0392b").pack(side="left", padx=5)

        self._load_visits()

    def _autoscroll(self, sb, first, last):
        first, last = float(first), float(last)
        if first <= 0 and last >= 1:
            sb.pack_forget()
        else:
            sb.pack(side="right", fill="y")
        sb.set(first, last)

    def _on_double_click(self, event):
        if self.tree.identify_row(event.y):
            self._open_view()

    def open_for_employee(self, emp):
        self._select_emp(emp)

    def _select_emp(self, emp):
        self.selected_emp = dict(emp)
        emp = self.selected_emp
        for w in self.emp_bar.winfo_children():
            w.destroy()

        name = f"{emp.get('rank','')} {emp['first_name']} {emp['last_name']}".strip()
        row1 = ctk.CTkFrame(self.emp_bar, fg_color="transparent")
        row1.pack(fill="x", padx=15, pady=(10, 2))
        ctk.CTkLabel(row1, text=f"MN: {emp.get('mn_number','-')}",
                     font=app_font(16)).pack(side="left", padx=(0, 15))
        ctk.CTkLabel(row1, text=name, font=app_font(18, "bold"),
                     text_color="#1a5276").pack(side="left")

        allergy = (emp.get("allergies") or "ไม่มี").strip()
        has_allergy = allergy not in ("", "ไม่มี")
        row2 = ctk.CTkFrame(self.emp_bar, fg_color="transparent")
        row2.pack(fill="x", padx=15, pady=(2, 10))
        ctk.CTkLabel(row2, text=f"สังกัด: {emp.get('department','-')}",
                     font=app_font(15)).pack(side="left", padx=(0, 15))
        ctk.CTkLabel(row2, text=f"กรุ๊ปเลือด: {emp.get('blood_type','-')}",
                     font=app_font(15)).pack(side="left", padx=(0, 15))
        allergy_label = ctk.CTkLabel(row2, text=f"แพ้ยา: {allergy}",
                                      font=app_font(15, "bold" if has_allergy else "normal"))
        if has_allergy:
            allergy_label.configure(text_color="#c0392b")
        allergy_label.pack(side="left", padx=(0, 15))
        ctk.CTkLabel(row2, text=f"โรคประจำตัว: {emp.get('underlying_diseases','-')}",
                     font=app_font(15)).pack(side="left")

        self._load_visits(emp["emp_id"])

    def _load_visits(self, emp_id=None):
        if emp_id:
            rows = self.db.fetchall("""
                SELECT v.visit_date, v.chief_complaint, v.diagnosis, v.treatment, v.notes, v.caregiver, v.id
                FROM visits v
                WHERE v.emp_id=?
                ORDER BY v.visit_date DESC, v.id DESC
            """, (emp_id,))
        else:
            rows = self.db.fetchall("""
                SELECT v.visit_date, v.chief_complaint, v.diagnosis, v.treatment, v.notes, v.caregiver, v.id
                FROM visits v
                ORDER BY v.visit_date DESC, v.id DESC LIMIT 200
            """)
        self.tree.delete(*self.tree.get_children())
        for r in rows:
            vals = list(r[:6])
            vals[0] = to_display(vals[0])
            self.tree.insert("", "end", iid=str(r[6]), values=vals)

    def _selected_visit_id(self):
        sel = self.tree.selection()
        if not sel:
            messagebox.showwarning("แจ้งเตือน", "กรุณาเลือกรายการก่อน")
            return None
        return int(sel[0])

    def _open_add(self):
        VisitDialog(self, self.db, self.selected_emp, None,
                    lambda eid=None: self._load_visits(eid or (self.selected_emp["emp_id"] if self.selected_emp else None)))

    def _open_view(self):
        vid = self._selected_visit_id()
        if vid:
            VisitDialog(self, self.db, None, vid, None)

    def _open_edit_visit(self):
        vid = self._selected_visit_id()
        if vid:
            eid = self.selected_emp["emp_id"] if self.selected_emp else None
            VisitDialog(self, self.db, None, vid,
                        lambda e=None: self._load_visits(e or eid), edit_mode=True)

    def _delete(self):
        vid = self._selected_visit_id()
        if not vid:
            return
        if messagebox.askyesno("ยืนยัน", "ลบประวัติการรักษานี้?"):
            self.db.execute("DELETE FROM medicine_dispensed WHERE visit_id=?", (vid,))
            self.db.execute("DELETE FROM visits WHERE id=?", (vid,))
            eid = self.selected_emp["emp_id"] if self.selected_emp else None
            self._load_visits(eid)

    def refresh(self):
        self._load_visits(self.selected_emp["emp_id"] if self.selected_emp else None)


class VisitDialog(ctk.CTkToplevel):
    def __init__(self, parent, db, emp, visit_id, on_save, edit_mode=False):
        super().__init__(parent)
        self.db = db
        self.emp = emp
        self.visit_id = visit_id
        self.on_save = on_save
        self.edit_mode = edit_mode
        self.readonly = visit_id is not None and not edit_mode
        self.med_items = []
        self.visit_emp_id = emp["emp_id"] if emp else None
        self.caregiver = ""

        if self.readonly:
            title = "ดูประวัติการรักษา"
        elif self.edit_mode:
            title = "แก้ไขประวัติการรักษา"
        else:
            title = "บันทึกการรักษา"
        self.title(title)
        self.geometry("700x780")
        self.transient(parent.winfo_toplevel())
        self.lift()
        self.focus_force()
        self._build()
        if self.visit_id:
            self._load_visit()
        elif self.emp:
            self._show_emp_bar(self.emp)

    def _build(self):
        s = "disabled" if self.readonly else "normal"

        scroll = ctk.CTkScrollableFrame(self, fg_color="transparent")
        scroll.pack(fill="both", expand=True, padx=15, pady=10)

        ctk.CTkLabel(scroll,
                     text=self.title(),
                     font=app_font(17, "bold")).pack(anchor="w", pady=(0, 8))

        self.emp_bar = ctk.CTkFrame(scroll, fg_color="#eaf2ff", corner_radius=6)
        self.emp_bar.pack(fill="x", pady=(0, 10))

        ctk.CTkLabel(scroll, text="วันที่รักษา", anchor="w").pack(fill="x")
        self.visit_date_entry = DateEntry(scroll, date_pattern="dd/mm/yyyy",
                                           font=("TH Sarabun PSK", 14),
                                           background="#1a5276", foreground="white",
                                           state=s)
        self.visit_date_entry.pack(fill="x", pady=(2, 8))
        if not self.readonly:
            self.visit_date_entry.set_date(date.today())

        ctk.CTkLabel(scroll, text="Vital Signs",
                     font=ctk.CTkFont(weight="bold")).pack(anchor="w", pady=(4, 4))
        vf = ctk.CTkFrame(scroll, fg_color="#f4f6f7", corner_radius=6)
        vf.pack(fill="x", pady=(0, 8))

        self.vitals = {}
        vital_defs = [("bp", "ความดัน", "120/80"), ("hr", "ชีพจร", "80"), ("temp", "อุณหภูมิ", "37.0"),
                      ("o2sat", "O2Sat", "98%"), ("height", "ส่วนสูง", "cm"), ("weight", "น้ำหนัก", "kg")]
        for key, lbl, ph in vital_defs:
            col = ctk.CTkFrame(vf, fg_color="transparent")
            col.pack(side="left", padx=10, pady=8)
            ctk.CTkLabel(col, text=lbl, font=app_font(14)).pack()
            e = ctk.CTkEntry(col, width=95, state=s, placeholder_text=ph)
            e.pack()
            self.vitals[key] = e

        def text_area(parent, label, height=70):
            ctk.CTkLabel(parent, text=label, font=ctk.CTkFont(weight="bold")).pack(anchor="w", pady=(8, 2))
            tb = ctk.CTkTextbox(parent, height=height, state=s)
            tb.pack(fill="x")
            return tb

        ctk.CTkLabel(scroll, text="ลักษณะการเจ็บป่วย",
                     font=ctk.CTkFont(weight="bold")).pack(anchor="w", pady=(4, 4))
        tf = ctk.CTkFrame(scroll, fg_color="#f4f6f7", corner_radius=6)
        tf.pack(fill="x", pady=(0, 8))
        self.trauma_var = ctk.StringVar(value="Non-trauma")
        for val in ["Trauma", "Non-trauma"]:
            ctk.CTkRadioButton(tf, text=val, variable=self.trauma_var, value=val,
                               state=s).pack(side="left", padx=15, pady=8)

        ctk.CTkLabel(scroll, text="ระบบโรค (เลือกได้หลายข้อ)",
                     font=ctk.CTkFont(weight="bold")).pack(anchor="w", pady=(4, 4))
        df = ctk.CTkFrame(scroll, fg_color="#f4f6f7", corner_radius=6)
        df.pack(fill="x", pady=(0, 8))
        self.disease_vars = {}
        for i, (code, label) in enumerate(DISEASE_SYSTEMS):
            var = ctk.BooleanVar(value=False)
            ctk.CTkCheckBox(df, text=f"{code} - {label}", variable=var,
                            state=s).grid(row=i // 2, column=i % 2, sticky="w", padx=10, pady=4)
            self.disease_vars[code] = var

        self.complaint  = text_area(scroll, "อาการ/ความเจ็บป่วย *")
        self.diagnosis  = text_area(scroll, "การวินิจฉัย")
        self.treatment  = text_area(scroll, "การรักษา/หัตถการ")

        ctk.CTkLabel(scroll, text="ยาที่จ่าย",
                     font=ctk.CTkFont(weight="bold")).pack(anchor="w", pady=(8, 2))
        self.med_outer = ctk.CTkFrame(scroll, fg_color="#f4f6f7", corner_radius=6)
        self.med_outer.pack(fill="x")
        self.med_list_frame = ctk.CTkFrame(self.med_outer, fg_color="transparent")
        self.med_list_frame.pack(fill="x", padx=5, pady=5)
        if not self.readonly:
            ctk.CTkButton(self.med_outer, text="+ เพิ่มยา", command=self._pick_med,
                          width=100).pack(anchor="w", padx=5, pady=(0, 5))

        self.notes = text_area(scroll, "หมายเหตุ", height=55)

        bf = ctk.CTkFrame(self, fg_color="transparent")
        bf.pack(fill="x", padx=15, pady=10)
        if not self.readonly:
            ctk.CTkButton(bf, text="บันทึก", command=self._save, width=120).pack(side="right", padx=5)
            ctk.CTkButton(bf, text="ยกเลิก", command=self.destroy, width=100,
                          fg_color="gray").pack(side="right")
        else:
            ctk.CTkButton(bf, text="ปิด", command=self.destroy, width=100).pack(side="right")

    def _render_emp_bar(self, emp):
        for w in self.emp_bar.winfo_children():
            w.destroy()

        name = f"{emp.get('rank','')} {emp['first_name']} {emp['last_name']}".strip()
        row1 = ctk.CTkFrame(self.emp_bar, fg_color="transparent")
        row1.pack(fill="x", padx=15, pady=(10, 2))
        ctk.CTkLabel(row1, text=f"MN: {emp.get('mn_number','-')}",
                     font=app_font(16)).pack(side="left", padx=(0, 15))
        ctk.CTkLabel(row1, text=name, font=app_font(18, "bold"),
                     text_color="#1a5276").pack(side="left")

        allergy = (emp.get("allergies") or "ไม่มี").strip()
        has_allergy = allergy not in ("", "ไม่มี")
        row2 = ctk.CTkFrame(self.emp_bar, fg_color="transparent")
        row2.pack(fill="x", padx=15, pady=(2, 10))
        ctk.CTkLabel(row2, text=f"สังกัด: {emp.get('department','-')}",
                     font=app_font(15)).pack(side="left", padx=(0, 15))
        ctk.CTkLabel(row2, text=f"กรุ๊ปเลือด: {emp.get('blood_type','-')}",
                     font=app_font(15)).pack(side="left", padx=(0, 15))
        allergy_label = ctk.CTkLabel(row2, text=f"แพ้ยา: {allergy}",
                                      font=app_font(15, "bold" if has_allergy else "normal"))
        if has_allergy:
            allergy_label.configure(text_color="#c0392b")
        allergy_label.pack(side="left", padx=(0, 15))
        ctk.CTkLabel(row2, text=f"โรคประจำตัว: {emp.get('underlying_diseases','-')}",
                     font=app_font(15)).pack(side="left")

    def _show_emp_bar(self, emp):
        self._render_emp_bar(emp)

    def _pick_med(self):
        meds = self.db.fetchall(
            "SELECT id, medicine_name, unit, stock_quantity, category_code FROM medicines ORDER BY medicine_name")
        if not meds:
            messagebox.showwarning("แจ้งเตือน", "ยังไม่มีข้อมูลยา กรุณาเพิ่มในโมดูลคลังยาก่อน")
            return
        selected_codes = {c for c, v in self.disease_vars.items() if v.get()}
        MedPickDialog(self, meds, self._add_med, selected_codes)

    def _add_med(self, med_id, name, qty, notes):
        self.med_items.append((med_id, name, qty, notes))
        self._refresh_med_list()

    def _refresh_med_list(self):
        for w in self.med_list_frame.winfo_children():
            w.destroy()
        for i, (mid, name, qty, notes) in enumerate(self.med_items):
            row = ctk.CTkFrame(self.med_list_frame, fg_color="transparent")
            row.pack(fill="x", pady=1)
            ctk.CTkLabel(row, text=f"• {name}  ×{qty}", width=260, anchor="w").pack(side="left", padx=5)
            if notes:
                ctk.CTkLabel(row, text=notes, text_color="gray", anchor="w").pack(side="left")
            if not self.readonly:
                idx = i
                ctk.CTkButton(row, text="ลบ", width=45, fg_color="#e74c3c",
                              command=lambda i=idx: self._remove_med(i)).pack(side="right", padx=5)

    def _remove_med(self, idx):
        self.med_items.pop(idx)
        self._refresh_med_list()

    def _load_visit(self):
        v = self.db.fetchone("""
            SELECT v.*, e.mn_number, e.rank, e.first_name, e.last_name, e.department,
                   e.blood_type, e.allergies, e.underlying_diseases
            FROM visits v JOIN employees e ON v.emp_id=e.emp_id WHERE v.id=?
        """, (self.visit_id,))
        if not v:
            return

        self.visit_emp_id = v["emp_id"]
        self._render_emp_bar(dict(v))
        self.caregiver = v["caregiver"]

        def fill(widget, val):
            widget.configure(state="normal")
            if isinstance(widget, ctk.CTkTextbox):
                widget.delete("1.0", "end")
                widget.insert("1.0", val or "")
            else:
                widget.delete(0, "end")
                widget.insert(0, val or "")
            if self.readonly:
                widget.configure(state="disabled")

        self.visit_date_entry.configure(state="normal")
        try:
            self.visit_date_entry.set_date(datetime.strptime(v["visit_date"], "%Y-%m-%d").date())
        except ValueError:
            pass
        if self.readonly:
            self.visit_date_entry.configure(state="disabled")
        self.trauma_var.set(v["is_trauma"] or "Non-trauma")
        selected = (v["disease_systems"] or "").split(",")
        for code, var in self.disease_vars.items():
            var.set(code in selected)
        for key in ["bp", "hr", "temp", "o2sat", "height", "weight"]:
            fill(self.vitals[key], v[key])
        fill(self.complaint, v["chief_complaint"])
        fill(self.diagnosis, v["diagnosis"])
        fill(self.treatment, v["treatment"])
        fill(self.notes, v["notes"])

        meds = self.db.fetchall("""
            SELECT md.medicine_id, m.medicine_name, md.quantity, md.notes
            FROM medicine_dispensed md JOIN medicines m ON md.medicine_id=m.id
            WHERE md.visit_id=?
        """, (self.visit_id,))
        self.med_items = [(r["medicine_id"], r["medicine_name"], r["quantity"], r["notes"]) for r in meds]
        self._refresh_med_list()

    def _save(self):
        if not self.edit_mode and not self.emp:
            messagebox.showwarning("แจ้งเตือน", "กรุณาค้นหาและเลือกพนักงานก่อน")
            return
        complaint = self.complaint.get("1.0", "end").strip()
        if not complaint:
            messagebox.showwarning("แจ้งเตือน", "กรุณากรอกอาการ")
            return

        visit_date = self.visit_date_entry.get_date().isoformat()
        disease_systems = ",".join(code for code, var in self.disease_vars.items() if var.get())
        vitals = (self.vitals["bp"].get(), self.vitals["hr"].get(), self.vitals["temp"].get(),
                  self.vitals["o2sat"].get(), self.vitals["height"].get(), self.vitals["weight"].get())
        diagnosis = self.diagnosis.get("1.0", "end").strip()
        treatment = self.treatment.get("1.0", "end").strip()
        notes = self.notes.get("1.0", "end").strip()
        caregiver = self.caregiver
        trauma = self.trauma_var.get()

        try:
            if self.edit_mode:
                self.db.execute("""
                    UPDATE visits SET visit_date=?, chief_complaint=?, bp=?, hr=?, temp=?, o2sat=?, height=?, weight=?,
                    diagnosis=?, treatment=?, notes=?, caregiver=?, is_trauma=?, disease_systems=?
                    WHERE id=?
                """, (visit_date, complaint, *vitals, diagnosis, treatment, notes,
                      caregiver, trauma, disease_systems, self.visit_id))

                old = self.db.fetchall(
                    "SELECT medicine_id, quantity FROM medicine_dispensed WHERE visit_id=?", (self.visit_id,))
                for r in old:
                    self.db.execute("UPDATE medicines SET stock_quantity=stock_quantity+? WHERE id=?",
                                     (r["quantity"], r["medicine_id"]))
                self.db.execute("DELETE FROM medicine_dispensed WHERE visit_id=?", (self.visit_id,))
                for med_id, _, qty, mnotes in self.med_items:
                    self.db.execute(
                        "INSERT INTO medicine_dispensed (visit_id,medicine_id,quantity,notes) VALUES (?,?,?,?)",
                        (self.visit_id, med_id, qty, mnotes))
                    self.db.execute(
                        "UPDATE medicines SET stock_quantity=stock_quantity-?,updated_at=datetime('now','localtime') WHERE id=?",
                        (qty, med_id))
            else:
                vid = self.db.lastrowid("""
                    INSERT INTO visits
                    (emp_id, visit_date, chief_complaint, bp, hr, temp, o2sat, height, weight, diagnosis, treatment, notes, caregiver, is_trauma, disease_systems)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """, (self.emp["emp_id"], visit_date, complaint, *vitals,
                      diagnosis, treatment, notes, caregiver, trauma, disease_systems))

                for med_id, _, qty, mnotes in self.med_items:
                    self.db.execute(
                        "INSERT INTO medicine_dispensed (visit_id,medicine_id,quantity,notes) VALUES (?,?,?,?)",
                        (vid, med_id, qty, mnotes))
                    self.db.execute(
                        "UPDATE medicines SET stock_quantity=stock_quantity-?,updated_at=datetime('now','localtime') WHERE id=?",
                        (qty, med_id))
        except Exception as exc:
            messagebox.showerror("ผิดพลาด", str(exc))
            return

        if self.on_save:
            self.on_save(self.visit_emp_id if self.edit_mode else self.emp["emp_id"])
        self.destroy()


class MedPickDialog(ctk.CTkToplevel):
    def __init__(self, parent, medicines, callback, selected_codes=None):
        super().__init__(parent)
        selected_codes = selected_codes or set()
        # ยาที่อยู่ในหมวดระบบโรคที่เลือกไว้ จะถูกเรียงขึ้นมาก่อน
        medicines = sorted(
            medicines,
            key=lambda m: (m["category_code"] not in selected_codes, m["medicine_name"]))
        self.medicines = medicines
        self.callback = callback
        self.title("เลือกยา")
        self.geometry("560x520")
        self.transient(parent.winfo_toplevel())
        self.lift()
        self.focus_force()

        ctk.CTkLabel(self, text="เลือกยา (เลือกได้หลายรายการ)",
                     font=app_font(16, "bold")).pack(pady=10)

        scroll = ctk.CTkScrollableFrame(self, fg_color="transparent")
        scroll.pack(fill="both", expand=True, padx=15, pady=(0, 5))

        self.rows = []
        for m in medicines:
            tag = f" [{m['category_code']}]" if m["category_code"] in selected_codes else ""
            row = ctk.CTkFrame(scroll, fg_color="#f4f6f7", corner_radius=6)
            row.pack(fill="x", pady=2)
            var = ctk.BooleanVar(value=False)
            label = f"{m['medicine_name']}{tag}  (คงเหลือ: {m['stock_quantity']} {m['unit']})"
            ctk.CTkCheckBox(row, text=label, variable=var, width=260).pack(side="left", padx=8, pady=6)
            qty = ctk.CTkEntry(row, width=70, placeholder_text="จำนวน")
            qty.insert(0, "1")
            qty.pack(side="left", padx=4)
            sig = ctk.CTkEntry(row, width=160, placeholder_text="วิธีใช้")
            sig.pack(side="left", padx=4)
            self.rows.append((m, var, qty, sig))

        ctk.CTkButton(self, text="เพิ่มรายการที่เลือก", command=self._confirm, width=160).pack(pady=10)

    def _confirm(self):
        added = 0
        for m, var, qty_e, sig_e in self.rows:
            if not var.get():
                continue
            try:
                qty = float(qty_e.get())
                if qty <= 0:
                    raise ValueError()
            except ValueError:
                messagebox.showwarning("ผิดพลาด", f"จำนวนของ '{m['medicine_name']}' ไม่ถูกต้อง")
                return
            self.callback(m["id"], m["medicine_name"], qty, sig_e.get().strip())
            added += 1
        if added == 0:
            messagebox.showwarning("แจ้งเตือน", "กรุณาเลือกยาอย่างน้อย 1 รายการ")
            return
        self.destroy()
