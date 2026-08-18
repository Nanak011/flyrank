const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Same seed-once contract as the SQLite version: create the table if
// missing, seed 3 example tasks only if it's empty.
async function ensureSchemaAndSeed() {
  const initSql = fs.readFileSync(path.join(__dirname, 'db', 'init.sql'), 'utf8');
  await pool.query(initSql);

  const { rows } = await pool.query('SELECT COUNT(*) AS count FROM tasks');
  if (Number(rows[0].count) === 0) {
    const insert = 'INSERT INTO tasks (title, done) VALUES ($1, $2)';
    await pool.query(insert, ['Task 1: Create a hello world server', true]);
    await pool.query(insert, ['Task 2: Create root and health endpoints', true]);
    await pool.query(insert, ['Task 3: Implement task CRUD operations', false]);
  }
}

// Same shape as the SQLite version's db.prepare() calls, now backed
// by Postgres. Routes never see SQL directly.
const taskRepository = {
  async getAll() {
    const { rows } = await pool.query('SELECT id, title, done FROM tasks ORDER BY id');
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT id, title, done FROM tasks WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async create(title, done) {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING id, title, done',
      [title, done]
    );
    return rows[0];
  },

  async update(id, title, done) {
    const { rows } = await pool.query(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING id, title, done',
      [title, done, id]
    );
    return rows[0];
  },

  async remove(id) {
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return rowCount > 0;
  },

  async healthCheck() {
    await pool.query('SELECT 1');
    return true;
  }
};

module.exports = { taskRepository, ensureSchemaAndSeed, pool };
