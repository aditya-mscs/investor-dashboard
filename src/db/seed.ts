import { pool } from "./pool.js";

async function seed() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS investors (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        date_of_birth DATE NOT NULL,
        phone TEXT NOT NULL,
        street TEXT NOT NULL,
        state TEXT NOT NULL,
        zip TEXT NOT NULL,
        ssn TEXT UNIQUE NOT NULL,
        file_path TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Seeded DB successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding DB:", err);
    process.exit(1);
  }
}

seed();
