import { pool } from "../../database/connectPostgres.js";

const getAllOrders = async (req, res) => {
  try {
    //only admin have access
    if (req.isAdmin === false) {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    //get all orders
    const ordersQuery = `
      SELECT id, user_id, guest_id, name, email, address, phone_number, total_amount, paid, created_at
      FROM orders
      ORDER BY created_at DESC
    `;

    const dbResOrdersQuery = await pool.query(ordersQuery);
    const orders = dbResOrdersQuery.rows;

    if (orders.length === 0) {
      return res.status(404).json({
        message: "No orders found",
      });
    }

    //get all ordered products
    const orderedProductsQuery = `
      SELECT 
        op.order_id,
        op.item_id AS id,
        p.id AS product_id,
        p._id,
        p.name,
        p.price,
        f.path AS product_image,
        op.quantity,
        op.price AS total_price
      FROM ordered_products op
      JOIN products p ON op.product_id = p.id
      LEFT JOIN files f ON p.product_image = f.id
    `;

    const dbResOrderedProductsQuery = await pool.query(orderedProductsQuery);

    const orderedProductsMap = dbResOrderedProductsQuery.rows.reduce(
      (acc, product) => {
        if (!acc[product.order_id]) {
          acc[product.order_id] = [];
        }
        acc[product.order_id].push({
          id: product.product_id,
          _id: product._id,
          name: product.name,
          price: parseFloat(product.price).toFixed(2),
          productImage: product.product_image
            ? `${process.env.SERVER_URL}/${product.product_image}`
            : null,
          quantity: product.quantity,
          totalPrice: parseFloat(product.total_price).toFixed(2),
        });
        return acc;
      },
      {}
    );

    //construct response
    const response = orders.map((order) => ({
      orderId: order.id,
      userId: order.user_id || order.guest_id,
      name: order.name,
      email: order.email,
      address: order.address,
      phoneNumber: order.phone_number,
      totalAmount: parseFloat(order.total_amount).toFixed(2),
      paid: order.paid,
      orderedProducts: orderedProductsMap[order.id] || [],
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getAllOrders;
