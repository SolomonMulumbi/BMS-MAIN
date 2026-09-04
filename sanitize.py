import json, re

# Load your current JSON file
with open("medicine_final.json", "r") as f:
    data = json.load(f)

sanitized = {"medicine": {}}

# Replace illegal Firebase characters with underscores
for key, value in data["medicine"].items():
    safe_key = re.sub(r'[.$#[\]/]', '_', key.strip())
    sanitized["medicine"][safe_key] = value

# Save cleaned JSON
with open("medicine_final_sanitized.json", "w") as f:
    json.dump(sanitized, f, indent=4)

print("✅ Sanitized file saved as medicine_final_sanitized.json")
