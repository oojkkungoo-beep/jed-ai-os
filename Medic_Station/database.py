import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "medic_station.db")

class Database:
    def __init__(self):
        self.conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self._create_tables()

    def _create_tables(self):
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                emp_id TEXT UNIQUE NOT NULL,
                mn_number TEXT DEFAULT '',
                rank TEXT DEFAULT '',
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                department TEXT DEFAULT '',
                dob TEXT DEFAULT '',
                gender TEXT DEFAULT '',
                blood_type TEXT DEFAULT '',
                allergies TEXT DEFAULT 'ไม่มี',
                underlying_diseases TEXT DEFAULT 'ไม่มี',
                phone TEXT DEFAULT '',
                created_at TEXT DEFAULT (datetime('now','localtime'))
            );

            CREATE TABLE IF NOT EXISTS visits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                emp_id TEXT NOT NULL,
                visit_date TEXT NOT NULL,
                chief_complaint TEXT DEFAULT '',
                bp TEXT DEFAULT '',
                hr TEXT DEFAULT '',
                temp TEXT DEFAULT '',
                o2sat TEXT DEFAULT '',
                weight TEXT DEFAULT '',
                diagnosis TEXT DEFAULT '',
                treatment TEXT DEFAULT '',
                notes TEXT DEFAULT '',
                caregiver TEXT DEFAULT '',
                is_trauma TEXT DEFAULT '',
                disease_systems TEXT DEFAULT '',
                created_at TEXT DEFAULT (datetime('now','localtime')),
                FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
            );

            CREATE TABLE IF NOT EXISTS medicines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                medicine_code TEXT DEFAULT '',
                medicine_name TEXT NOT NULL,
                unit TEXT DEFAULT 'เม็ด',
                stock_quantity REAL DEFAULT 0,
                min_stock REAL DEFAULT 10,
                category_code TEXT DEFAULT '',
                created_at TEXT DEFAULT (datetime('now','localtime')),
                updated_at TEXT DEFAULT (datetime('now','localtime'))
            );

            CREATE TABLE IF NOT EXISTS medicine_dispensed (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                visit_id INTEGER NOT NULL,
                medicine_id INTEGER NOT NULL,
                quantity REAL NOT NULL,
                notes TEXT DEFAULT '',
                FOREIGN KEY (visit_id) REFERENCES visits(id),
                FOREIGN KEY (medicine_id) REFERENCES medicines(id)
            );

            CREATE TABLE IF NOT EXISTS announcements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now','localtime'))
            );
        """)
        self.conn.commit()
        self._migrate()

    def _migrate(self):
        cols = [r["name"] for r in self.conn.execute("PRAGMA table_info(visits)")]
        for col in ("caregiver", "is_trauma", "disease_systems", "height"):
            if col not in cols:
                self.conn.execute(f"ALTER TABLE visits ADD COLUMN {col} TEXT DEFAULT ''")
                self.conn.commit()

        # หมวดระบบโรค "g" (Gastrointestinal) เปลี่ยนเป็น "G"
        self.conn.execute("UPDATE medicines SET category_code='G' WHERE category_code='g'")
        for r in self.conn.execute("SELECT id, disease_systems FROM visits WHERE disease_systems LIKE '%g%'"):
            codes = [c if c != "g" else "G" for c in r["disease_systems"].split(",")]
            self.conn.execute("UPDATE visits SET disease_systems=? WHERE id=?", (",".join(codes), r["id"]))
        self.conn.commit()

        emp_cols = [r["name"] for r in self.conn.execute("PRAGMA table_info(employees)")]
        if "mn_number" not in emp_cols:
            self.conn.execute("ALTER TABLE employees ADD COLUMN mn_number TEXT DEFAULT ''")
        if "rank" not in emp_cols:
            self.conn.execute("ALTER TABLE employees ADD COLUMN rank TEXT DEFAULT ''")
        if "mn_number" not in emp_cols or "rank" not in emp_cols:
            self.conn.commit()

        med_cols = [r["name"] for r in self.conn.execute("PRAGMA table_info(medicines)")]
        if "category_code" not in med_cols:
            self.conn.execute("ALTER TABLE medicines ADD COLUMN category_code TEXT DEFAULT ''")
            self.conn.commit()

        # one-time: เปลี่ยนรหัสยาเดิม M001-M008 (ไม่มีหมวด) ให้เป็นรูปแบบ <หมวด>-NNN ตามระบบโรค
        old_code_categories = {
            "M001": "M",  # พาราเซตามอล 500mg
            "M002": "O",  # ไอบูโพรเฟน 400mg
            "M003": "R",  # ยาแก้แพ้ (CPM)
            "M004": "G",  # ผงเกลือแร่ ORS
            "M005": "R",  # ยาแก้ไอ น้ำเชื่อม
            "M006": "I",  # แอลกอฮอล์ล้างแผล
            "M007": "I",  # พลาสเตอร์ปิดแผล
            "M008": "G",  # ยาธาตุน้ำขาว
        }
        for old_code, cat in old_code_categories.items():
            row = self.conn.execute("SELECT id FROM medicines WHERE medicine_code=?", (old_code,)).fetchone()
            if row:
                new_code = self.next_medicine_code(cat)
                self.conn.execute("UPDATE medicines SET medicine_code=?, category_code=? WHERE id=?",
                                  (new_code, cat, row["id"]))
        self.conn.commit()

    def next_medicine_code(self, category_code):
        """Generate next medicine code for a category: <category_code>-NNN (e.g. R-001)."""
        prefix = f"{category_code}-"
        row = self.conn.execute(
            "SELECT medicine_code FROM medicines WHERE medicine_code LIKE ? ORDER BY medicine_code DESC LIMIT 1",
            (prefix + "%",)).fetchone()
        suffix = row["medicine_code"][len(prefix):] if row else ""
        seq = int(suffix) + 1 if suffix.isdigit() else 1
        return f"{prefix}{seq:03d}"

    def next_mn_number(self):
        """Generate next MN registration number: BB + 5-digit sequence (BB = 2-digit Buddhist year)."""
        from datetime import date
        yy = (date.today().year + 543) % 100
        prefix = f"{yy:02d}"
        row = self.conn.execute(
            "SELECT mn_number FROM employees WHERE mn_number LIKE ? ORDER BY mn_number DESC LIMIT 1",
            (prefix + "%",)).fetchone()
        seq = int(row["mn_number"][2:]) + 1 if row and row["mn_number"][2:].isdigit() else 1
        return f"{prefix}{seq:05d}"

    def execute(self, sql, params=()):
        cur = self.conn.execute(sql, params)
        self.conn.commit()
        return cur

    def fetchall(self, sql, params=()):
        return self.conn.execute(sql, params).fetchall()

    def fetchone(self, sql, params=()):
        return self.conn.execute(sql, params).fetchone()

    def lastrowid(self, sql, params=()):
        cur = self.conn.execute(sql, params)
        self.conn.commit()
        return cur.lastrowid

    def close(self):
        self.conn.close()
