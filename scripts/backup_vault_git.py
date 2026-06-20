import shutil
from pathlib import Path
from datetime import date

GITDATA = Path(r"D:\Second_Brain_gitdata\Second_Brain.git")
BACKUP_DIR = Path(r"D:\NB_G_Drive\Second_Brain_git_backup")
KEEP_LAST = 8  # ~2 months of weekly backups

def main():
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = date.today().isoformat()
    dest = BACKUP_DIR / f"second-brain-git-{stamp}"
    if dest.with_suffix(".zip").exists():
        print(f"SKIP: backup for {stamp} already exists")
        return
    archive_path = shutil.make_archive(str(dest), "zip", root_dir=str(GITDATA))
    print(f"BACKED UP: {archive_path}")

    zips = sorted(BACKUP_DIR.glob("second-brain-git-*.zip"))
    while len(zips) > KEEP_LAST:
        old = zips.pop(0)
        old.unlink()
        print(f"PRUNED old backup: {old.name}")

if __name__ == "__main__":
    main()
