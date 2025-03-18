import { pool } from "../../database/connectPostgres.js";

const updateProduct = async (req, res) => {
  try {
    const product_id = req.params._id;
    const { name, description, quantity, price, category, available } =
      req.body;
    let imgFileId = null;

    //TODO: isAuth

    //check if product valid
    const productQuery = `
    SELECT *
    FROM products
    WHERE _id = $1
    `;
    const dbResProductQuery = await pool.query(productQuery, [product_id]);
    const product = dbResProductQuery.rows[0];

    if (!product) {
      return res.status(400).json({
        message: "Product not found",
      });
    }

    //update product details
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

    const updateProductQuery = `
    UPDATE products
    SET
      name = COALESCE ($1, name),
      description = COALESCE ($2, description),
      quantity = COALESCE ($3, quantity),
      price = COALESCE ($4, price),
      product_image = COALESCE ($5, product_image),
      category = COALESCE ($6, category),
      available = COALESCE ($7, available)
    WHERE _id = $8
    RETURNING *
    `;

    const dbResUpdateProductQuery = await pool.query(updateProductQuery, [
      name,
      description,
      quantity,
      price,
      imgFileId,
      category,
      available,
      product_id,
    ]);

    const updatedProduct = dbResUpdateProductQuery.rows[0];

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default updateProduct;
