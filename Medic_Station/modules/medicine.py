import customtkinter as ctk
from tkinter import ttk, messagebox
from constants import MEDICINE_CATEGORIES, MEDICINE_CATEGORY_LABELS
from utils import app_font


class MedicineModule(ctk.CTkFrame):
    def __init__(self, parent, db):
        super().__init__(parent, corner_radius=0, fg_color="transparent")
        self.db = db
        self._build()

    def _build(self):
        header = ctk.CTkFrame(self, fg_color="white", corner_radius=8)
        header.pack(fill="x", padx=15, pady=(15, 5))
        ctk.CTkLabel(header, text="💊 คลังยา",
                     font=app_font(18, "bold")).pack(side="left", padx=15, pady=10)
        ctk.CTkButton(header, text="+ เพิ่มยาใหม่", command=self._open_add,
                      width=120).pack(side="right", padx=10, pady=8)

        sf = ctk.CTkFrame(self, fg_color="white", corner_radius=8)
        sf.pack(fill="x", padx=15, pady=5)
        ctk.CTkLabel(sf, text="ค้นหา:").pack(side="left", padx=10, pady=8)
        self.search_var = ctk.StringVar()
        self.search_var.trace("w", lambda *a: self._load())
        ctk.CTkEntry(sf, textvariable=self.search_var, width=280,
                     placeholder_text="ชื่อยา หรือ รหัสยา").pack(side="left", padx=5)
        self.alert_label = ctk.CTkLabel(sf, text="", text_color="#e74c3c",
                                         font=app_font(14))
        self.alert_label.pack(side="right", padx=15)

        tf = ctk.CTkFrame(self, fg_color="white", corner_radius=8)
        tf.pack(fill="both", expand=True, padx=15, pady=(5, 15))

        cols    = ("code", "name", "category", "unit", "stock", "min_stock", "status")
        headers = ("รหัสยา", "ชื่อยา", "หมวด", "หน่วย", "คงเหลือ", "ขั้นต่ำ", "สถานะ")
        widths  = (90, 220, 70, 70, 90, 90, 110)

        wrap = ctk.CTkFrame(tf, fg_color="transparent")
        wrap.pack(fill="both", expand=True, padx=10, pady=10)

        self.tree = ttk.Treeview(wrap, columns=cols, show="headings", selectmode="browse")
        for col, hdr, w in zip(cols, headers, widths):
            self.tree.heading(col, text=hdr)
            self.tree.column(col, width=w, anchor="center")
        self.tree.column("name", anchor="w")
        self.tree.tag_configure("out",  background="#f5b7b1")
        self.tree.tag_configure("low",  background="#fdecea")
        self.tree.tag_configure("ok",   background="white")
        self.tree.bind("<Double-1>", lambda e: self._open_edit())

        sb = ttk.Scrollbar(wrap, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=sb.set)
        self.tree.pack(side="left", fill="both", expand=True)
        sb.pack(side="right", fill="y")

        af = ctk.CTkFrame(tf, fg_color="transparent")
        af.pack(fill="x", padx=10, pady=(0, 10))
        ctk.CTkButton(af, text="📦 รับยาเข้าคลัง", command=self._stock_in,
                      width=130, fg_color="#27ae60", hover_color="#1e8449").pack(side="left", padx=5)
        ctk.CTkButton(af, text="✏️ แก้ไข", command=self._open_edit,
                      width=100, fg_color="#2980b9").pack(side="left", padx=5)
        ctk.CTkButton(af, text="🗑️ ลบ", command=self._delete,
                      width=100, fg_color="#e74c3c", hover_color="#c0392b").pack(side="left", padx=5)

        self._load()

    def _load(self):
        q = self.search_var.get().strip()
        like = f"%{q}%"
        if q:
            rows = self.db.fetchall("""
                SELECT id, medicine_code, medicine_name, unit, stock_quantity, min_stock, category_code
                FROM medicines WHERE medicine_name LIKE ? OR medicine_code LIKE ?
                ORDER BY medicine_name
            """, (like, like))
        else:
            rows = self.db.fetchall("""
                SELECT id, medicine_code, medicine_name, unit, stock_quantity, min_stock, category_code
                FROM medicines ORDER BY medicine_name
            """)

        self.tree.delete(*self.tree.get_children())
        low_count = 0
        for r in rows:
            mid, code, name, unit, stock, min_s, cat = r
            if stock <= 0:
                status, tag = "⚠️ หมด", "out"
                low_count += 1
            elif stock <= min_s:
                status, tag = "⚠️ ใกล้หมด", "low"
                low_count += 1
            else:
                status, tag = "✅ ปกติ", "ok"
            self.tree.insert("", "end", iid=str(mid),
                             values=(code, name, cat or "-", unit, stock, min_s, status), tags=(tag,))

        self.alert_label.configure(
            text=f"⚠️ ยาใกล้หมด/หมด {low_count} รายการ" if low_count else "")

    def _selected_id(self):
        sel = self.tree.selection()
        if not sel:
            messagebox.showwarning("แจ้งเตือน", "กรุณาเลือกรายการก่อน")
            return None
        return int(sel[0])

    def _open_add(self):
        MedicineDialog(self, self.db, None, self._load)

    def _open_edit(self):
        mid = self._selected_id()
        if mid:
            MedicineDialog(self, self.db, mid, self._load)

    def _stock_in(self):
        mid = self._selected_id()
        if mid:
            StockInDialog(self, self.db, mid, self._load)

    def _delete(self):
        mid = self._selected_id()
        if not mid:
            return
        row = self.db.fetchone("SELECT medicine_name FROM medicines WHERE id=?", (mid,))
        if messagebox.askyesno("ยืนยัน", f"ลบยา '{row['medicine_name']}' ?"):
            self.db.execute("DELETE FROM medicines WHERE id=?", (mid,))
            self._load()

    def refresh(self):
        self._load()


class MedicineDialog(ctk.CTkToplevel):
    def __init__(self, parent, db, med_id, on_save):
        super().__init__(parent)
        self.db = db
        self.med_id = med_id
        self.on_save = on_save
        self.title("เพิ่มยา" if not med_id else "แก้ไขข้อมูลยา")
        self.geometry("420x460")
        self.resizable(False, False)
        self.grab_set()
        self._build()
        if med_id:
            self._load()

    def _build(self):
        ctk.CTkLabel(self, text="เพิ่มยา" if not self.med_id else "แก้ไขข้อมูลยา",
                     font=app_font(17, "bold")).pack(pady=15)

        form = ctk.CTkFrame(self, fg_color="transparent")
        form.pack(fill="both", expand=True, padx=25)

        ctk.CTkLabel(form, text="หมวดระบบโรค *", anchor="w").pack(fill="x", pady=(8, 0))
        self.category_placeholder = "-- เลือกหมวด --"
        self.category_values = [self.category_placeholder] + [f"{c} - {l}" for c, l in MEDICINE_CATEGORIES]
        self.category_var = ctk.StringVar(value=self.category_values[0])
        ctk.CTkComboBox(form, variable=self.category_var, values=self.category_values,
                        command=lambda *_: self._update_code()).pack(fill="x")

        ctk.CTkLabel(form, text="รหัสยา (สร้างอัตโนมัติตามหมวด)", anchor="w").pack(fill="x", pady=(8, 0))
        self.code_entry = ctk.CTkEntry(form, state="disabled")
        self.code_entry.pack(fill="x")

        self.fields = {}
        defs = [
            ("medicine_name",  "ชื่อยา *",              ""),
            ("unit",           "หน่วย",                 "เม็ด"),
            ("stock_quantity", "จำนวนเริ่มต้น",         "0"),
            ("min_stock",      "ขั้นต่ำที่แจ้งเตือน",   "10"),
        ]
        for key, label, default in defs:
            ctk.CTkLabel(form, text=label, anchor="w").pack(fill="x", pady=(8, 0))
            e = ctk.CTkEntry(form)
            if default:
                e.insert(0, default)
            e.pack(fill="x")
            self.fields[key] = e

        bf = ctk.CTkFrame(self, fg_color="transparent")
        bf.pack(fill="x", padx=25, pady=15)
        ctk.CTkButton(bf, text="บันทึก", command=self._save, width=120).pack(side="right", padx=5)
        ctk.CTkButton(bf, text="ยกเลิก", command=self.destroy, width=100,
                      fg_color="gray").pack(side="right")

    def _set_code(self, code):
        self.code_entry.configure(state="normal")
        self.code_entry.delete(0, "end")
        self.code_entry.insert(0, code)
        self.code_entry.configure(state="disabled")

    def _selected_category(self):
        cat_sel = self.category_var.get()
        return cat_sel.split(" - ")[0] if " - " in cat_sel else ""

    def _update_code(self):
        cat = self._selected_category()
        if not cat:
            self._set_code("")
            return
        if self.med_id and cat == self.original_category:
            self._set_code(self.original_code)
        else:
            self._set_code(self.db.next_medicine_code(cat))

    def _load(self):
        row = self.db.fetchone("SELECT * FROM medicines WHERE id=?", (self.med_id,))
        if row:
            for key in ["medicine_name", "unit", "stock_quantity", "min_stock"]:
                self.fields[key].delete(0, "end")
                self.fields[key].insert(0, str(row[key] or ""))
            self.original_category = row["category_code"] or ""
            self.original_code = row["medicine_code"] or ""
            if self.original_category and self.original_category in MEDICINE_CATEGORY_LABELS:
                self.category_var.set(f"{self.original_category} - {MEDICINE_CATEGORY_LABELS[self.original_category]}")
            else:
                self.category_var.set(self.category_values[0])
            self._update_code()

    def _save(self):
        name = self.fields["medicine_name"].get().strip()
        if not name:
            messagebox.showwarning("แจ้งเตือน", "กรุณากรอกชื่อยา")
            return
        category_code = self._selected_category()
        if not category_code:
            messagebox.showwarning("แจ้งเตือน", "กรุณาเลือกหมวดระบบโรค")
            return
        try:
            stock   = float(self.fields["stock_quantity"].get() or 0)
            min_s   = float(self.fields["min_stock"].get() or 10)
        except ValueError:
            messagebox.showwarning("ผิดพลาด", "จำนวนต้องเป็นตัวเลข")
            return

        code = self.code_entry.get().strip()
        unit = self.fields["unit"].get().strip() or "เม็ด"

        if self.med_id:
            self.db.execute("""
                UPDATE medicines SET medicine_code=?,medicine_name=?,unit=?,
                stock_quantity=?,min_stock=?,category_code=?,updated_at=datetime('now','localtime')
                WHERE id=?
            """, (code, name, unit, stock, min_s, category_code, self.med_id))
        else:
            self.db.execute("""
                INSERT INTO medicines (medicine_code,medicine_name,unit,stock_quantity,min_stock,category_code)
                VALUES (?,?,?,?,?,?)
            """, (code, name, unit, stock, min_s, category_code))

        self.on_save()
        self.destroy()


class StockInDialog(ctk.CTkToplevel):
    def __init__(self, parent, db, med_id, on_save):
        super().__init__(parent)
        self.db = db
        self.med_id = med_id
        self.on_save = on_save
        self.title("รับยาเข้าคลัง")
        self.geometry("360x240")
        self.resizable(False, False)
        self.grab_set()

        med = db.fetchone("SELECT * FROM medicines WHERE id=?", (med_id,))

        ctk.CTkLabel(self, text="รับยาเข้าคลัง",
                     font=app_font(17, "bold")).pack(pady=15)

        info = ctk.CTkFrame(self, fg_color="#eaf2ff", corner_radius=6)
        info.pack(fill="x", padx=20, pady=5)
        ctk.CTkLabel(info,
                     text=f"ยา: {med['medicine_name']}  |  คงเหลือ: {med['stock_quantity']} {med['unit']}",
                     font=app_font(14)).pack(pady=8)

        row = ctk.CTkFrame(self, fg_color="transparent")
        row.pack(fill="x", padx=20, pady=10)
        ctk.CTkLabel(row, text="จำนวนที่รับเข้า:", width=130, anchor="w").pack(side="left")
        self.qty = ctk.CTkEntry(row, width=120)
        self.qty.pack(side="left", padx=5)

        bf = ctk.CTkFrame(self, fg_color="transparent")
        bf.pack(pady=15)
        ctk.CTkButton(bf, text="บันทึก", command=self._save, width=120,
                      fg_color="#27ae60", hover_color="#1e8449").pack(side="right", padx=5)
        ctk.CTkButton(bf, text="ยกเลิก", command=self.destroy, width=100,
                      fg_color="gray").pack(side="right")

    def _save(self):
        try:
            qty = float(self.qty.get())
            if qty <= 0:
                raise ValueError()
        except ValueError:
            messagebox.showwarning("ผิดพลาด", "กรุณากรอกจำนวนที่ถูกต้อง")
            return
        self.db.execute("""
            UPDATE medicines SET stock_quantity=stock_quantity+?,
            updated_at=datetime('now','localtime') WHERE id=?
        """, (qty, self.med_id))
        self.on_save()
        self.destroy()
