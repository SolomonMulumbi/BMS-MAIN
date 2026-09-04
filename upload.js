import admin from "firebase-admin";
import xlsx from "xlsx";
import { readFileSync } from "fs";

// --- Initialize Firebase Admin ---
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" }; // ensure you have this file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://YOUR-DATABASE-NAME.firebaseio.com", // change this
});

const db = admin.database();

// --- Read Excel File ---
const workbook = xlsx.readFile("./KEAH PRICE LIST 24.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

// --- Helper to guess measurement ---
function guessMeasurement(drugName) {
  const lower = drugName.toLowerCase();
  if (lower.includes("cream")) return "g";
  if (lower.includes("syrup")) return "ml";
  if (lower.includes("tablet") || lower.includes("tab") || lower.includes("mg")) return "mg";
  if (lower.includes("capsule") || lower.includes("cap")) return "mg";
  return "pcs";
}

// --- Get Today and Next Year Dates ---
const today = new Date().toISOString().split("T")[0];
const nextYear = new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split("T")[0];

// --- Upload to Firebase ---
async function uploadMedicines() {
  for (const item of data) {
    const name = String(item["Drug Name"] || "").trim().toUpperCase();
    const quantity = item["QUANTITY"] || 0;
    const keah = item["KEAH"] || 0;
    const apa = item["APA"] || 0;

    if (!name) continue;

    const medicineData = {
      name,
      parents: quantity,
      supplier: "ABACUS",
      measurement: guessMeasurement(name),
      dos: today,
      dob: nextYear,
      insurancePrices: {
        keah,
        apa,
        ga: 0,
      },
    };

    await db.ref(`medicine/${name}`).set(medicineData);
    console.log(`✅ Uploaded: ${name}`);
  }

  console.log("🎉 All medicines uploaded successfully!");
}

uploadMedicines().catch(console.error);
