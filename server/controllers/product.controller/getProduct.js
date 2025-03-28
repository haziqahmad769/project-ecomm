import { pool } from "../../database/connectPostgres.js";

const getProduct = async (req, res) => {
  try {
    const product_id = req.params._id;

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

    //get product details
    const getProductQuery = `
    SELECT
        p.id,
        p._id,
        p.name,
        p.description,
        p.quantity,
        p.price,
        f.path AS product_image,
        p.category,
        p.available,
        p.created_at,
        p.updated_at
    FROM products p
    LEFT JOIN files f on p.product_image = f.id
    WHERE p._id = $1
    `;

    const dbResGetProductQuery = await pool.query(getProductQuery, [
      product_id,
    ]);
    const getProduct = dbResGetProductQuery.rows[0];

    //construct response
    const response = {
      id: getProduct.id,
      _id: getProduct._id,
      name: getProduct.name,
      description: getProduct.description,
      quantity: getProduct.quantity,
      price: getProduct.price,
      productImage: getProduct.product_image
        ? `${process.env.SERVER_URL}/${getProduct.product_image}`
        : null,
      category: getProduct.category,
      available: getProduct.available,
      craetedAt: getProduct.created_at,
      updatedAt: getProduct.updated_at,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getProduct;
