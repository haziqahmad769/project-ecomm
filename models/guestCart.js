import { pool } from "../database/connectPostgres.js";

const query = `
CREATE TABLE IF NOT EXISTS guest_carts (
    id SERIAL PRIMARY KEY,
    guest_id TEXT UNIQUE NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    total_price NUMERIC(10,2) NOT NULL DEFAULT 0
);
`;

const createGuestCartsTable = async () => {
  try {
    await pool.query(query);
    console.log("Guest carts table is created");
  } catch (error) {
    console.error(error);
  }
};

export default createGuestCartsTable;
