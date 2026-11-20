with open("no name/js/main.js", "r", encoding="utf-8") as f:
    text = f.read()

for i, line in enumerate(text.splitlines()):
    if "siteAudio" in line or "Audio" in line or "sound" in line or "WebAudio" in line:
        print(f"main.js:{i+1}: {line.strip()[:100]}")
