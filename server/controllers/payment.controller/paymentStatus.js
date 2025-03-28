import { pool } from "../../database/connectPostgres.js";

const paymentStatus = async (req, res) => {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    //check payment status
    const orderQuery = `
    SELECT paid 
    FROM orders 
    WHERE _id = $1
    `;

    const dbResOrderQuery = await pool.query(orderQuery, [order_id]);

    if (dbResOrderQuery.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({ paid: dbResOrderQuery.rows[0].paid });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default paymentStatus;
