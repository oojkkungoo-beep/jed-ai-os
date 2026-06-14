import customtkinter as ctk

FONT_FAMILY = "TH Sarabun PSK"
MIN_FONT_SIZE = 14


def app_font(size=14, weight="normal"):
    """Shared app font (TH Sarabun PSK), enforcing a minimum size of 14."""
    return ctk.CTkFont(family=FONT_FAMILY, size=max(size, MIN_FONT_SIZE), weight=weight)


def to_iso(s):
    """DD/MM/YYYY -> YYYY-MM-DD"""
    s = (s or "").strip()
    if not s:
        return ""
    try:
        p = s.split("/")
        if len(p) == 3 and len(p[2]) == 4:
            return f"{p[2]}-{p[1].zfill(2)}-{p[0].zfill(2)}"
    except Exception:
        pass
    return s

def to_display(s):
    """YYYY-MM-DD -> DD/MM/YYYY"""
    s = (s or "").strip()
    if not s:
        return ""
    try:
        p = s.split("-")
        if len(p) == 3:
            return f"{p[2]}/{p[1]}/{p[0]}"
    except Exception:
        pass
    return s
