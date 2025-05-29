import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Configuration - ideally, these should come from environment variables or a config file
const BACKUP_DIR = path.join(os.homedir(), 'ticketing_backups'); // Example backup directory
const DB_NAME = process.env.DB_NAME || 'your_database_name';
const DB_USER = process.env.DB_USER || 'your_db_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'your_db_password';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432'; // Example for PostgreSQL

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Creates a timestamp string for filenames.
 * @returns {string} Formatted timestamp (YYYY-MM-DD_HH-MM-SS)
 */
function getTimestamp(): string {
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const DD = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const MIN = String(now.getMinutes()).padStart(2, '0');
  const SS = String(now.getSeconds()).padStart(2, '0');
  return `${YYYY}-${MM}-${DD}_${HH}-${MIN}-${SS}`;
}

/**
 * Backs up the database.
 * This is a generic example. You'll need to adjust the command for your specific database (e.g., pg_dump, mysqldump).
 */
export async function backupDatabase(): Promise<void> {
  const timestamp = getTimestamp();
  const backupFilePath = path.join(BACKUP_DIR, `db_backup_${DB_NAME}_${timestamp}.sql`);

  // Example for PostgreSQL. Adjust for your database.
  // Ensure pg_dump is in your PATH or provide the full path to the executable.
  // For security, it's better to use a .pgpass file or similar mechanism for passwords if your DB supports it.
  const command = `pg_dump -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} ${DB_NAME} > "${backupFilePath}"`;
  // For MySQL: `mysqldump -u ${DB_USER} -p${DB_PASSWORD} -h ${DB_HOST} -P ${DB_PORT} ${DB_NAME} > "${backupFilePath}"`
  // Note: For mysqldump, -p${DB_PASSWORD} has no space. If password has special chars, quote it or use an options file.

  console.log(`Starting database backup for '${DB_NAME}' to '${backupFilePath}'...`);

  return new Promise((resolve, reject) => {
    // Set PGPASSWORD for pg_dump if needed and not using .pgpass
    const env = { ...process.env };
    if (DB_PASSWORD && command.startsWith('pg_dump')) { // Only set for pg_dump if password is provided
      env.PGPASSWORD = DB_PASSWORD;
    }

    exec(command, { env }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Database backup failed: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        return reject(error);
      }
      if (stderr) {
        // pg_dump might output some info to stderr even on success
        console.warn(`Database backup stderr: ${stderr}`);
      }
      console.log(`Database backup successful: ${backupFilePath}`);
      resolve();
    });
  });
}

/**
 * Backs up specified project files/directories.
 * @param {string[]} pathsToBackup - Array of absolute paths to files or directories to backup.
 * @param {string} archiveNamePrefix - Prefix for the archive file name.
 */
export async function backupFiles(pathsToBackup: string[], archiveNamePrefix: string = 'project_files'): Promise<void> {
  if (!pathsToBackup || pathsToBackup.length === 0) {
    console.warn('No files or directories specified for backup. Skipping file backup.');
    return Promise.resolve();
  }

  const timestamp = getTimestamp();
  const archiveFileName = `${archiveNamePrefix}_${timestamp}.tar.gz`; // Using tar.gz for broad compatibility
  const archiveFilePath = path.join(BACKUP_DIR, archiveFileName);

  // Construct the tar command. This example assumes 'tar' is available in the system PATH.
  // This will create a gzipped tarball.
  // We need to be careful with paths, especially if they contain spaces.
  const filesToArchive = pathsToBackup.map(p => `"${path.basename(p)}"`).join(' ');
  // Get the common parent directory to cd into, to avoid full paths in tar archive
  // For simplicity, this example assumes pathsToBackup are in the same directory or uses relative paths from a CWD.
  // A more robust solution would handle diverse path structures.
  // For this example, we'll assume the command is run from a directory where pathsToBackup are relative or use absolute paths carefully.

  // For simplicity, let's assume pathsToBackup are relative to project root or absolute.
  // If using absolute paths, tar will store them. To make them relative in archive, cd to a common parent.
  // Example: tar -czf archive.tar.gz -C /path/to/parent dir1 file2
  // This example will use absolute paths directly for simplicity, meaning they'll be stored with full paths in the archive.
  // Consider changing CWD for tar if relative paths within the archive are desired.

  const command = `tar -czf "${archiveFilePath}" ${pathsToBackup.map(p => `"${p}"`).join(' ')}`;

  console.log(`Starting file backup to '${archiveFilePath}'...`);
  console.log(`Files/Directories to backup: ${pathsToBackup.join(', ')}`);

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`File backup failed: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        return reject(error);
      }
      if (stderr) {
        console.warn(`File backup stderr: ${stderr}`);
      }
      console.log(`File backup successful: ${archiveFilePath}`);
      resolve();
    });
  });
}

// Example usage (you might call these from a cron job or a main script):
async function runBackups() {
  try {
    console.log('--- Starting Backup Process ---');
    
    // Backup Database
    // Ensure DB_NAME, DB_USER, etc. are correctly set in your environment or config
    await backupDatabase();

    // Backup Files
    // Replace with actual paths to your important project files/directories
    // e.g., uploaded files, configuration, etc.
    const projectRoot = path.resolve(__dirname, '../..'); // Assuming scripts is in project_root/scripts
    const filesToBackup = [
      // path.join(projectRoot, 'uploads'), // Example: user uploaded content
      // path.join(projectRoot, '.env'),    // Example: environment configuration (if not sensitive or handled differently)
      // path.join(projectRoot, 'src')      // Example: source code (if not version controlled elsewhere for backup)
      // For this example, let's try to backup the 'public' folder if it exists
    ];
    const publicDir = path.join(projectRoot, 'public');
    if (fs.existsSync(publicDir)) {
        filesToBackup.push(publicDir);
    }
    // Add other critical paths as needed

    if (filesToBackup.length > 0) {
      await backupFiles(filesToBackup, 'ticketing_app_files');
    } else {
      console.log('No specific project files configured for backup in this example.');
    }

    console.log('--- Backup Process Completed Successfully ---');
  } catch (error) {
    console.error('--- Backup Process Failed ---');
    console.error(error);
  }
}

// If this script is run directly, execute the backup process
if (require.main === module) {
  console.log('Running backup script directly...');
  runBackups();
}
