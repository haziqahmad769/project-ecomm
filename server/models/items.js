import { pool } from "../database/connectPostgres.js";

const query = `
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES cart_items(id) ON DELETE CASCADE,
    guest_cart_id INTEGER REFERENCES guest_carts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT check_cart_exclusivity CHECK (
        (cart_id IS NOT NULL AND guest_cart_id IS NULL) OR 
        (cart_id IS NULL AND guest_cart_id IS NOT NULL)
    )
);
`;

const createItemsTable = async () => {
  try {
    await pool.query(query);
    console.log("Items table is created");
  } catch (error) {
    console.error(error);
  }
};

export default createItemsTable;
