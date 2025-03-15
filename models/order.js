import { pool } from "../database/connectPostgres.js";

const query = `
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    _id TEXT UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
`;

const createOrdersTable = async () => {
  try {
    await pool.query(query);
    console.log("Orders table is created");
  } catch (error) {
    console.error(error);
  }
};

export default createOrdersTable;
