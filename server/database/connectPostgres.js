import pg from "pg";
import createFilesTable from "../models/file.js";
import createUsersTable from "../models/user.js";
import createProductsTable from "../models/product.js";
import createCartItemsTable from "../models/cartItem.js";
import createGuestCartsTable from "../models/guestCart.js";
import createItemsTable from "../models/items.js";
import createOrdersTable from "../models/order.js";
import createOrderedProductsTable from "../models/orderedProduct.js";
import createTriggers from "../models/trigger.js";

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL, // Use DATABASE_URL for Render
        ssl: {
          rejectUnauthorized: false, // Required for connecting to Render Postgres
        },
      }
    : {
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        max: 20, // set pool max size to 20
        idleTimeoutMillis: 1000, // close idle clients after 1 second
        connectionTimeoutMillis: 1000,
      }
);

export const databaseInit = async () => {
  try {
    //   promise is pending
    const dbName = await pool.query("SELECT current_database()");
    const dbRes = await pool.query("SELECT NOW()");
    const time = dbRes.rows[0].now;
    const name = dbName.rows[0].current_database;

    //   promise is fullfilled
    console.log(`Connected to ${name} at ${time}`);

    // create database tables
    await createFilesTable();
    await createUsersTable();
    await createProductsTable();
    await createCartItemsTable();
    await createGuestCartsTable();
    await createItemsTable();
    await createOrdersTable();
    await createOrderedProductsTable();

    //create triggers
    await createTriggers();
  } catch (error) {
    console.error(error);
    console.error("Database connection failed");
  }
};
