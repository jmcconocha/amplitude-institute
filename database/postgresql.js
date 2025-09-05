// Alternative PostgreSQL setup for Render deployment
const { Pool } = require('pg');

class DatabaseService {
  constructor() {
    // Use DATABASE_URL environment variable that Render provides
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  async initDatabase() {
    const client = await this.pool.connect();
    
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

      // Check if admin user exists
      const adminCheck = await client.query(
        'SELECT id FROM users WHERE email = $1', 
        [process.env.ADMIN_EMAIL || 'jmcconocha@abydosone.ltd']
      );

      if (adminCheck.rows.length === 0) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'TempAdmin123!', 12);
        
        await client.query(`
          INSERT INTO users (email, password, first_name, last_name, role, status, is_admin)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          process.env.ADMIN_EMAIL || 'jmcconocha@abydosone.ltd',
          hashedPassword,
          'Admin',
          'User',
          'admin',
          'approved',
          true
        ]);
        
        console.log('🔐 Admin user created:', process.env.ADMIN_EMAIL || 'jmcconocha@abydosone.ltd');
      }

      console.log('✅ PostgreSQL database initialized');
    } finally {
      client.release();
    }
  }

  getPool() {
    return this.pool;
  }

  async query(text, params) {
    return await this.pool.query(text, params);
  }
}

module.exports = new DatabaseService();