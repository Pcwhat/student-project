with open("no name/css/projects.css", "r", encoding="utf-8") as f:
    text = f.read()

lines = text.splitlines()
for i, line in enumerate(lines):
    if "directory-toolbar" in line or "toolbar" in line:
        for j in range(max(0, i-2), min(len(lines), i+25)):
            print(f"{j+1}: {lines[j]}")
        break
