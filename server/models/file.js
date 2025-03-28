import { pool } from "../database/connectPostgres.js";

const query = `
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    fieldname TEXT NOT NULL,
    originalname TEXT NOT NULL,
    encoding TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    destination TEXT NOT NULL,
    filename TEXT NOT NULL,
    path TEXT NOT NULL,
    size INTEGER NOT NULL
);
`;

const createFilesTable = async () => {
  try {
    await pool.query(query);
    console.log("Files table is created");
  } catch (error) {
    console.error(error);
  }
};

export default createFilesTable;
