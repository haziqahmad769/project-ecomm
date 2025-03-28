import { pool } from "../../database/connectPostgres.js";

const deleteProduct = async (req, res) => {
  try {
    const product_id = req.params._id;

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

    //delete product
    const deleteProductQuery = `
    DELETE FROM products
    WHERE _id = $1
    `;
    const dbResDeleteProductQuery = await pool.query(deleteProductQuery, [
      product_id,
    ]);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default deleteProduct;
