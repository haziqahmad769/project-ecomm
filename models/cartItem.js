import { pool } from "../database/connectPostgres.js";

const query = `
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_quantity INTEGER NOT NULL,
    total_price NUMERIC(10,2) NOT NULL
);
`;

const createCartItemsTable = async () => {
  try {
    await pool.query(query);
    console.log("Cart items table is created");
  } catch (error) {
    console.error(error);
  }
};

export default createCartItemsTable;
