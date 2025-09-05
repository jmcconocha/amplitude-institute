const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || './database.sqlite';

let db = null;

function initDatabase() {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      return;
    }
    console.log('✅ Connected to SQLite database');
    createTables();
  });
}

function createTables() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      organization TEXT,
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'pending',
      registration_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved_at DATETIME NULL,
      approved_by INTEGER NULL,
      last_login DATETIME NULL,
      FOREIGN KEY (approved_by) REFERENCES users (id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('✅ Users table ready');
      createAdminUser();
    }
  });

  // Registration requests table for tracking
  db.run(`
    CREATE TABLE IF NOT EXISTS registration_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      processed_at DATETIME NULL,
      processed_by INTEGER NULL,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (processed_by) REFERENCES users (id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating registration_requests table:', err.message);
    } else {
      console.log('✅ Registration requests table ready');
    }
  });

  // Sessions table for better session management
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      user_agent TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating sessions table:', err.message);
    } else {
      console.log('✅ Sessions table ready');
    }
  });
}

async function createAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'jmcconocha@abydosone.ltd';
  
  return new Promise((resolve, reject) => {
    // Check if admin user exists
    db.get('SELECT id FROM users WHERE email = ? AND role = ?', [adminEmail, 'admin'], async (err, row) => {
      if (err) {
        console.error('Error checking admin user:', err);
        reject(err);
        return;
      }
      
      if (!row) {
        // Create admin user with default password (should be changed on first login)
        const defaultPassword = 'TempAdmin123!';
        const passwordHash = await bcrypt.hash(defaultPassword, 12);
        
        db.run(`
          INSERT INTO users (email, password_hash, first_name, last_name, role, status, approved_at)
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [adminEmail, passwordHash, 'Admin', 'User', 'admin', 'approved'], function(err) {
          if (err) {
            console.error('Error creating admin user:', err);
            reject(err);
          } else {
            console.log(`🔐 Admin user created: ${adminEmail}`);
            console.log(`🔑 Default password: ${defaultPassword}`);
            console.log('⚠️  Please change this password immediately after first login!');
            resolve(this.lastID);
          }
        });
      } else {
        console.log('✅ Admin user already exists');
        resolve(row.id);
      }
    });
  });
}

function getDatabase() {
  return db;
}

module.exports = {
  initDatabase,
  getDatabase,
  createAdminUser
};