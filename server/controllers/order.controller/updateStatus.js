import { pool } from "../../database/connectPostgres.js";

const updateStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    // only admin have access
    if (req.isAdmin === false) {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    // check order exist and is paid
    const orderQuery = `
    SELECT paid 
    FROM orders 
    WHERE id = $1
    `;

    const dbResOrderQuery = await pool.query(orderQuery, [order_id]);

    if (dbResOrderQuery.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!dbResOrderQuery.rows[0].paid) {
      return res.status(400).json({
        message: "Cannot update status for unpaid order",
      });
    }

    // update status
    const statusQuery = `
    UPDATE orders 
    SET status = $1 
    WHERE id = $2
    `;

    const dbResStatusQuery = await pool.query(statusQuery, [status, order_id]);

    const updatedStatus = dbResStatusQuery.rows[0];

    res.status(200).json({
      message: "Order status updated successfully",
      data: updatedStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default updateStatus;
