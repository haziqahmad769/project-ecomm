import { pool } from "../database/connectPostgres.js";

const query = `
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    _id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    product_image INTEGER REFERENCES files(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
`;

const createProductsTable = async () => {
  try {
    await pool.query(query);
    console.log("Products table is created");
  } catch (error) {
    console.error(error);
  }
};

export default createProductsTable;
