import { pool } from "../../database/connectPostgres.js";
import crypto from "crypto";

const createProduct = async (req, res) => {
  try {
    const { name, quantity, price, category } = req.body;
    let imgFileId = null;

    //TODO: isAuth

    //name, quantity, price, image & category required
    if (req.file) {
      const file = req.file;

      const fileInsertQuery = `
              INSERT INTO files (fieldname, originalname, encoding, mimetype, destination, filename, path, size)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              RETURNING id
              `;

      const fileResult = await pool.query(fileInsertQuery, [
        file.fieldname,
        file.originalname,
        file.encoding,
        file.mimetype,
        file.destination,
        file.filename,
        file.path,
        file.size,
      ]);

      imgFileId = fileResult.rows[0].id;
    }

    if (!name || !quantity || !price || !imgFileId || !category) {
      return res.status(400).json({
        message: "Product must have name, quantity, price, image and category",
      });
    }

    //insert product details
    const _id = crypto.randomBytes(16).toString("hex");

    const query = `
    INSERT INTO products (_id, name, quantity, price, product_image, category)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, _id, name, quantity, price, product_image, category, created_at
    `;

    const dbRes = await pool.query(query, [
      _id,
      name,
      quantity,
      price,
      imgFileId,
      category,
    ]);
    const product = dbRes.rows[0];

    // console.log(dbRes);
    res.status(200).json({
      message: "Product created successfuly",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default createProduct;
