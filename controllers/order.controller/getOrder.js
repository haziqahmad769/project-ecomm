import { pool } from "../../database/connectPostgres.js";

const getOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const user_id = req.userId;
    const guest_id = req.cookies.guest_id;

    //order_id is required
    if (!order_id) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    //get order details
    const orderQuery = `
      SELECT id, user_id, guest_id, name, email, address, phone_number, total_amount, paid
      FROM orders
      WHERE id = $1 AND (user_id = $2 OR guest_id = $3)
    `;

    const dbResOrderQuery = await pool.query(orderQuery, [
      order_id,
      user_id,
      guest_id,
    ]);

    if (dbResOrderQuery.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found or access denied",
      });
    }

    const order = dbResOrderQuery.rows[0];

    //get ordered product details
    const orderedProductsQuery = `
      SELECT 
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
      WHERE op.order_id = $1
    `;

    const dbResOrderedProductsQuery = await pool.query(orderedProductsQuery, [
      order_id,
    ]);

    const orderedProducts = dbResOrderedProductsQuery.rows.map((product) => ({
      id: product.product_id,
      _id: product._id,
      name: product.name,
      price: parseFloat(product.price).toFixed(2),
      productImage: product.product_image
        ? `${process.env.SERVER_URL}/${product.product_image}`
        : null,
      quantity: product.quantity,
      totalPrice: (parseFloat(product.price) * product.quantity).toFixed(2),
    }));

    //construct response
    const response = {
      orderId: order.id,
      userId: order.user_id || order.guest_id,
      name: order.name,
      email: order.email,
      address: order.address,
      phoneNumber: order.phone_number,
      totalAmount: parseFloat(order.total_amount).toFixed(2),
      paid: order.paid,
      orderedProducts,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getOrder;
