import { pool } from "../database/connectPostgres.js";

const query = `
CREATE TABLE IF NOT EXISTS ordered_products (
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    cart_item_id INTEGER REFERENCES cart_items(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (order_id, cart_item_id)
);
`;

const createOrderedProductsTable = async () => {
  try {
    await pool.query(query);
    console.log("Ordered products table is created");
  } catch (error) {
    console.error(error);
  }
};

export default createOrderedProductsTable;
