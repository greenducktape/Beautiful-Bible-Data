import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In Vercel, the file might be in a different location relative to the function
// We'll try a few common locations
const dbName = 'bible.sqlite';

function getDbPath() {
  const candidates = [
    // 1. Vercel / Root: process.cwd() is usually the project root
    path.join(process.cwd(), dbName),
    // 2. Relative to this file (backend/db.ts -> ../bible.sqlite)
    path.resolve(__dirname, '..', dbName),
    // 3. Relative to api/index.ts (api/index.ts -> ../bible.sqlite) if bundled differently
    path.resolve(__dirname, '..', '..', dbName),
    // 4. Vercel specific: sometimes files are in the root of the function
    path.join(process.cwd(), 'api', dbName),
    // 5. /tmp for writeable copy (if needed, though we use readonly)
    '/tmp/bible.sqlite'
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      console.log(`Found database at: ${candidate}`);
      return candidate;
    }
  }
  
  // If not found, log error and return default (which will fail, but with better logs)
  console.error(`Database file ${dbName} not found in any of the candidate paths:`, candidates);
  return path.join(process.cwd(), dbName);
}

let dbInstance: Database.Database | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  const dbPath = getDbPath();
  console.log('Initializing DB at:', dbPath);
  
  try {
    dbInstance = new Database(dbPath, { readonly: true });
    // dbInstance.pragma('journal_mode = WAL'); // Cannot set WAL in readonly mode
  } catch (error) {
    console.error(`Failed to open database at ${dbPath}:`, error);
    // Fallback for Vercel: sometimes files are moved to specific paths
    // Try one more location if the first failed?
    throw error;
  }

  return dbInstance;
}
