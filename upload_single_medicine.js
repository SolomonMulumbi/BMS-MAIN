const fs = require('fs');
const path = require('path');
const os = require('os');
const firebase = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Missing serviceAccountKey.json in script folder:', serviceAccountPath);
  process.exit(1);
}
const serviceAccount = require(serviceAccountPath);

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://keah-f80f4-default-rtdb.firebaseio.com'
});
const db = firebase.database();

// CLI args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const providedPath = args.find(a => a !== '--dry-run');

// locate JSON file
const filename = 'keah-f80f4-default-rtdb-export.json';
const candidates = [];
if (providedPath) candidates.push(path.resolve(providedPath));
candidates.push(path.join(__dirname, filename));
candidates.push(path.join(os.homedir(), 'Downloads', filename));
candidates.push(path.join(__dirname, '..', filename));

const inputFile = candidates.find(p => p && fs.existsSync(p));
if (!inputFile) {
  console.error('Could not find JSON file. Tried:\n', candidates.join('\n'));
  console.error('Usage: node upload_single_medicine.js [path/to/json] [--dry-run]');
  process.exit(1);
}

console.log('Using JSON file:', inputFile, dryRun ? '(dry-run)' : '');

const raw = fs.readFileSync(inputFile, 'utf8');
let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error('Invalid JSON:', e.message);
  process.exit(1);
}

function sanitizeKey(key) {
  return key.replace(/[_\/]+/g, ' ').trim().replace(/\s+/g, ' ');
}

async function reuploadAllMedicines() {
  const medicines = data.medicine || {};
  const firebaseRef = db.ref('medicine');

  for (const originalKey of Object.keys(medicines)) {
    const entry = medicines[originalKey];
    const sanitizedKey = sanitizeKey(originalKey);
    const sanitizedName = entry.name ? sanitizeKey(entry.name) : sanitizedKey;

    // prepare entry copy with sanitized name
    const newEntry = Object.assign({}, entry, { name: sanitizedName });

    if (dryRun) {
      console.log('[dry-run] would set /medicine/' + sanitizedKey, newEntry);
      if (sanitizedKey !== originalKey) {
        console.log('[dry-run] would remove /medicine/' + originalKey);
      }
      continue;
    }

    try {
      // write full medicine object under sanitized key (overwrites)
      await firebaseRef.child(sanitizedKey).set(newEntry);
      console.log('Set /medicine/' + sanitizedKey);

      // remove original keyed node when different
      if (sanitizedKey !== originalKey) {
        await firebaseRef.child(originalKey).remove();
        console.log('Removed old node /medicine/' + originalKey);
      }
    } catch (err) {
      console.error('Error processing', originalKey, '->', sanitizedKey, err);
    }
  }

  console.log('Reupload complete.');
  process.exit(0);
}

reuploadAllMedicines().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});


