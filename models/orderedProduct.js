import { pool } from "../database/connectPostgres.js";

const query = `
CREATE TABLE IF NOT EXISTS ordered_products (
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id) ON DELETE SET NULL,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (order_id, product_id)
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
