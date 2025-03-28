import { pool } from "../../database/connectPostgres.js";

const getAllProducts = async (req, res) => {
  try {
    //TODO: isAuth

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
    `;

    const dbResGetProductQuery = await pool.query(getProductQuery);
    const getProduct = dbResGetProductQuery.rows;

    //construct response
    const response = getProduct.map((getProduct) => ({
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
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getAllProducts;
