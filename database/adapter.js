const bcrypt = require('bcryptjs');

class DatabaseAdapter {
  constructor() {
    this.db = null;
    this.dbType = process.env.USE_POSTGRESQL === 'true' ? 'postgresql' : 'sqlite';
    
    if (this.dbType === 'postgresql') {
      const { Pool } = require('pg');
      this.db = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
    } else {
      const sqlite3 = require('sqlite3').verbose();
      const path = require('path');
      const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'users.db');
      this.db = new sqlite3.Database(DB_PATH);
    }
  }

  async initDatabase() {
    if (this.dbType === 'postgresql') {
      await this.initPostgreSQL();
    } else {
      await this.initSQLite();
    }
    
    await this.createAdminUser();
    console.log('✅ Database initialization complete');
  }

  async initPostgreSQL() {
    const client = await this.db.connect();
    
    try {
      // Create users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          organization VARCHAR(255),
          registration_reason TEXT,
          role VARCHAR(50) DEFAULT 'user',
          status VARCHAR(50) DEFAULT 'pending',
          is_admin BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          approved_at TIMESTAMP,
          approved_by INTEGER,
          last_login TIMESTAMP
        )
      `);

      // Create registration_requests table
      await client.query(`
        CREATE TABLE IF NOT EXISTS registration_requests (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'pending',
          admin_notes TEXT,
          processed_by INTEGER REFERENCES users(id),
          processed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create sessions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          token_hash VARCHAR(255),
          expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('✅ PostgreSQL tables created');
    } finally {
      client.release();
    }
  }

  async initSQLite() {
    return new Promise((resolve, reject) => {
      // Create users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          organization VARCHAR(255),
          registration_reason TEXT,
          role VARCHAR(50) DEFAULT 'user',
          status VARCHAR(50) DEFAULT 'pending',
          is_admin BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          approved_at DATETIME,
          approved_by INTEGER,
          last_login DATETIME
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Create registration_requests table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS registration_requests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'pending',
          admin_notes TEXT,
          processed_by INTEGER REFERENCES users(id),
          processed_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Create sessions table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          token_hash VARCHAR(255),
          expires_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ SQLite tables created');
          resolve();
        }
      });
    });
  }

  async createAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL || 'jmcconocha@abydosone.ltd';
    const adminPassword = process.env.ADMIN_PASSWORD || 'TempAdmin123!';

    if (this.dbType === 'postgresql') {
      const client = await this.db.connect();
      try {
        const result = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
        
        if (result.rows.length === 0) {
          const hashedPassword = await bcrypt.hash(adminPassword, 12);
          await client.query(`
            INSERT INTO users (email, password, first_name, last_name, role, status, is_admin)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [adminEmail, hashedPassword, 'Admin', 'User', 'admin', 'approved', true]);
          
          console.log('🔐 Admin user created:', adminEmail);
          console.log('🔑 Default password:', adminPassword);
          console.log('⚠️  Please change this password immediately after first login!');
        }
      } finally {
        client.release();
      }
    } else {
      return new Promise((resolve, reject) => {
        this.db.get('SELECT id FROM users WHERE email = ?', [adminEmail], async (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            const hashedPassword = await bcrypt.hash(adminPassword, 12);
            this.db.run(`
              INSERT INTO users (email, password, first_name, last_name, role, status, is_admin)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [adminEmail, hashedPassword, 'Admin', 'User', 'admin', 'approved', 1], (err) => {
              if (err) {
                reject(err);
              } else {
                console.log('🔐 Admin user created:', adminEmail);
                console.log('🔑 Default password:', adminPassword);
                console.log('⚠️  Please change this password immediately after first login!');
                resolve();
              }
            });
          } else {
            resolve();
          }
        });
      });
    }
  }

  getDatabase() {
    return this.db;
  }
}

// Create single instance
const dbAdapter = new DatabaseAdapter();

module.exports = {
  initDatabase: () => dbAdapter.initDatabase(),
  getDatabase: () => dbAdapter.getDatabase(),
  dbType: dbAdapter.dbType
};