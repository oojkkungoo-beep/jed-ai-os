"""Seed Medic_Station database with sample data for testing/demo.
Run: python seed_data.py
"""
import sys
import os
from datetime import date, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from database import Database

db = Database()

employees = [
    ("E001", "สมชาย",   "ใจดี",      "ผลิต",        "1985-03-12", "ชาย", "O",  "ไม่มี",        "ความดันสูง",  "081-111-1111"),
    ("E002", "สมหญิง",  "รักงาน",    "บัญชี",       "1990-07-22", "หญิง", "A",  "เพนิซิลลิน",    "ไม่มี",        "081-222-2222"),
    ("E003", "วิชัย",   "มั่นคง",    "คลังสินค้า",  "1988-11-05", "ชาย", "B",  "ไม่มี",        "เบาหวาน",     "081-333-3333"),
    ("E004", "นภา",     "แสงทอง",    "ผลิต",        "1995-01-30", "หญิง", "AB", "ไม่มี",        "ไม่มี",        "081-444-4444"),
    ("E005", "ประยุทธ", "ทำงานดี",   "ขนส่ง",       "1982-09-14", "ชาย", "O",  "ไม่มี",        "ไม่มี",        "081-555-5555"),
    ("E006", "มาลี",    "ดอกไม้",    "บุคคล",       "1992-05-18", "หญิง", "A",  "แอสไพริน",    "หอบหืด",      "081-666-6666"),
    ("E007", "ธนวัฒน์", "เจริญพร",   "ผลิต",        "1987-12-02", "ชาย", "B",  "ไม่มี",        "ไม่มี",        "081-777-7777"),
    ("E008", "อรุณี",   "สว่างใจ",   "คลังสินค้า",  "1993-08-09", "หญิง", "O",  "ไม่มี",        "ไม่มี",        "081-888-8888"),
]

for emp_id, fname, lname, dept, dob, gender, blood, allergy, disease, phone in employees:
    db.execute("""
        INSERT OR IGNORE INTO employees
        (emp_id, first_name, last_name, department, dob, gender, blood_type, allergies, underlying_diseases, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (emp_id, fname, lname, dept, dob, gender, blood, allergy, disease, phone))

# key, หมวดระบบโรค (ใช้สร้างรหัสยา <หมวด>-NNN อัตโนมัติ), ชื่อยา, หน่วย, จำนวนเริ่มต้น, ขั้นต่ำ
medicines = [
    ("M001", "M", "พาราเซตามอล 500mg", "เม็ด", 500, 50),
    ("M002", "O", "ไอบูโพรเฟน 400mg",  "เม็ด", 200, 30),
    ("M003", "R", "ยาแก้แพ้ (CPM)",     "เม็ด", 150, 30),
    ("M004", "G", "ผงเกลือแร่ ORS",     "ซอง",  100, 20),
    ("M005", "R", "ยาแก้ไอ น้ำเชื่อม",   "ขวด",  40,  10),
    ("M006", "I", "แอลกอฮอล์ล้างแผล",   "ขวด",  60,  10),
    ("M007", "I", "พลาสเตอร์ปิดแผล",    "แผ่น", 300, 50),
    ("M008", "G", "ยาธาตุน้ำขาว",       "ขวด",  30,  10),
]

med_ids = {}
for key, cat, name, unit, stock, min_stock in medicines:
    code = db.next_medicine_code(cat)
    cur = db.execute("""
        INSERT OR IGNORE INTO medicines (medicine_code, medicine_name, unit, stock_quantity, min_stock, category_code)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (code, name, unit, stock, min_stock, cat))
    row = db.fetchone("SELECT id FROM medicines WHERE medicine_name=?", (name,))
    med_ids[key] = row["id"]

today = date.today()
visits = [
    ("E001", 1,  "ปวดหัว มีไข้",        "BP 130/85", "82", "37.8", "98", "65", "ไข้หวัดใหญ่",        "พักผ่อน ทานยาตามสั่ง", "", [("M001", 10), ("M004", 2)]),
    ("E002", 2,  "ปวดท้อง",             "BP 110/70", "76", "36.8", "99", "55", "กรดไหลย้อน",        "ให้ยาธาตุน้ำขาว",      "", [("M008", 1)]),
    ("E003", 3,  "ปวดหลังจากยกของ",      "BP 125/82", "78", "36.9", "98", "70", "กล้ามเนื้ออักเสบ",   "ให้ยาแก้ปวด พักงาน",   "", [("M002", 6)]),
    ("E004", 4,  "แผลถูกของบาด",         "BP 118/76", "80", "36.7", "99", "52", "บาดแผลเล็กน้อย",     "ทำแผล ปิดพลาสเตอร์",   "", [("M006", 1), ("M007", 3)]),
    ("E005", 5,  "ไอ มีเสมหะ",           "BP 122/80", "84", "37.1", "97", "68", "หลอดลมอักเสบ",       "ให้ยาแก้ไอ",           "", [("M005", 1)]),
    ("E006", 7,  "หอบเหนื่อย",           "BP 128/84", "90", "37.0", "96", "58", "หอบหืดกำเริบเล็กน้อย","พ่นยา พักผ่อน",        "เฝ้าระวังอาการ", [("M001", 4)]),
    ("E007", 8,  "ปวดหัว เวียนหัว",      "BP 135/88", "80", "36.9", "98", "75", "ความดันสูงเล็กน้อย", "ให้ยาลดปวด วัดความดันซ้ำ", "", [("M001", 6)]),
    ("E008", 10, "แพ้อาหาร ผื่นคัน",     "BP 115/74", "82", "36.8", "99", "50", "ลมพิษ",             "ให้ยาแก้แพ้",          "", [("M003", 4)]),
    ("E001", 12, "ปวดฟัน",              "BP 120/80", "78", "36.7", "98", "65", "ปวดฟัน",            "ให้ยาแก้ปวด แนะนำพบทันตแพทย์", "", [("M001", 4)]),
    ("E003", 14, "ตรวจน้ำตาลประจำเดือน", "BP 130/85", "76", "36.6", "98", "70", "เบาหวาน (ติดตาม)",  "วัด DTX ติดตามอาการ",  "DTX 145 mg/dL", []),
    ("E002", 16, "เป็นหวัด",             "BP 112/72", "74", "37.0", "99", "55", "ไข้หวัด",           "ให้ยาลดไข้ พักผ่อน",   "", [("M001", 10), ("M003", 6)]),
    ("E004", 18, "ปวดประจำเดือน",        "BP 116/76", "78", "36.7", "99", "52", "ปวดประจำเดือน",     "ให้ยาแก้ปวด",          "", [("M002", 4)]),
    ("E005", 20, "บาดแผลถูกความร้อน",    "BP 124/80", "82", "36.9", "98", "68", "แผลไฟไหม้เล็กน้อย", "ทำแผล ปิดพลาสเตอร์",   "", [("M006", 1), ("M007", 2)]),
    ("E006", 22, "เป็นไข้ ไอ",           "BP 130/86", "88", "37.6", "97", "58", "ไข้หวัดใหญ่",       "ให้ยาลดไข้ ยาแก้ไอ",   "", [("M001", 6), ("M005", 1)]),
    ("E007", 24, "ปวดเข่า",              "BP 134/88", "80", "36.8", "98", "75", "ข้อเข่าอักเสบ",     "ให้ยาแก้ปวด พักการใช้งาน", "", [("M002", 6)]),
]

for emp_id, days_ago, complaint, bp, hr, temp, o2, weight, diag, treatment, notes, meds in visits:
    vdate = (today - timedelta(days=days_ago)).isoformat()
    visit_id = db.lastrowid("""
        INSERT INTO visits (emp_id, visit_date, chief_complaint, bp, hr, temp, o2sat, weight, diagnosis, treatment, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (emp_id, vdate, complaint, bp, hr, temp, o2, weight, diag, treatment, notes))
    for code, qty in meds:
        db.execute("""
            INSERT INTO medicine_dispensed (visit_id, medicine_id, quantity)
            VALUES (?, ?, ?)
        """, (visit_id, med_ids[code], qty))
        db.execute("UPDATE medicines SET stock_quantity = stock_quantity - ? WHERE id=?", (qty, med_ids[code]))

db.close()
print(f"Seeded {len(employees)} employees, {len(medicines)} medicines, {len(visits)} visits.")
