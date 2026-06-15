"""Shared lookup tables: disease-system categories and medicine category codes."""

# 8 หมวดระบบโรค สำหรับ checkbox ในฟอร์มบันทึกการรักษา
# 7 หมวดแรกมีรหัสยาตามหมวด (ใช้ผูกกับคลังยา), หมวดที่ 8 (อื่นๆ) ไม่มีรหัส
DISEASE_SYSTEMS = [
    ("R", "ระบบทางเดินหายใจ (Respiratory)"),
    ("C", "ระบบหัวใจและหลอดเลือด (Cardiovascular)"),
    ("G", "ระบบทางเดินอาหาร (Gastrointestinal)"),
    ("U", "ระบบทางเดินปัสสาวะ/สืบพันธุ์ (Urogenital)"),
    ("O", "ระบบกระดูกและกล้ามเนื้อ (Orthopedic)"),
    ("I", "ระบบผิวหนัง/บาดแผลติดเชื้อ (Integumentary)"),
    ("D", "ทันตกรรม/ช่องปาก (Dental)"),
    ("M", "อื่นๆ/ทั่วไป (Misc)"),
]

# รหัสยาตามหมวดระบบโรค (ใช้ในคลังยา) — ครอบคลุมทุกหมวดของ DISEASE_SYSTEMS รวม M (อื่นๆ/ทั่วไป)
MEDICINE_CATEGORIES = DISEASE_SYSTEMS

MEDICINE_CATEGORY_LABELS = dict(MEDICINE_CATEGORIES)
DISEASE_SYSTEM_LABELS = dict(DISEASE_SYSTEMS)

# สิทธิ์ผู้ใช้งานระบบ
USER_ROLES = [
    ("admin", "ผู้ดูแลระบบ"),
    ("user", "ผู้ใช้งาน"),
]
USER_ROLE_LABELS = dict(USER_ROLES)
