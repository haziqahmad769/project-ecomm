import { pool } from "../../database/connectPostgres.js";

const paymentWebhook = async (req, res) => {
  try {
    const {
      refno, // order_id
      status, // "1" means paid
      amount, // amount paid
    } = req.body;

    // console.log("Webhook received:", req.body);

    //ensure required fields present
    if (!refno || !status) {
      return res.status(400).json({
        message: "Invalid payload",
      });
    }

    //check payment
    if (status !== "1") {
      return res.status(400).json({
        message: "Payment not completed",
      });
    }

    //verify order exist & not already paid
    const orderQuery = `
    SELECT * 
    FROM orders 
    WHERE id = $1 AND paid = false
    `;

    const dbResOrderQuery = await pool.query(orderQuery, [refno]);

    if (dbResOrderQuery.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found or already paid",
      });
    }

    //update order as paid
    const updateOrderQuery = `
    UPDATE orders 
    SET paid = true 
    WHERE id = $1
    `;

    const dbResUpdateOrderQuery = await pool.query(updateOrderQuery, [refno]);

    // console.log(`Order ${refno} marked as paid`);

    //fetch cart items linked to order
    const cartItemsQuery = `
    SELECT i.product_id, i.total_quantity 
    FROM items i
    WHERE i.${dbResOrderQuery.rows[0].user_id ? "cart_id" : "guest_cart_id"} = (
        SELECT id FROM ${
          dbResOrderQuery.rows[0].user_id ? "cart_items" : "guest_carts"
        }
        WHERE ${dbResOrderQuery.rows[0].user_id ? "user_id" : "guest_id"} = $1
    )
    `;

    const dbResCartItemsQuery = await pool.query(cartItemsQuery, [
      dbResOrderQuery.rows[0].user_id
        ? dbResOrderQuery.rows[0].user_id
        : dbResOrderQuery.rows[0].guest_id,
    ]);

    //update stock
    const updateStockQuery = `
    UPDATE products
    SET quantity = quantity - items.total_quantity
    FROM items
    WHERE products.id = items.product_id
    AND items.${
      dbResOrderQuery.rows[0].user_id ? "cart_id" : "guest_cart_id"
    } = (
      SELECT id FROM ${
        dbResOrderQuery.rows[0].user_id ? "cart_items" : "guest_carts"
      }
      WHERE ${dbResOrderQuery.rows[0].user_id ? "user_id" : "guest_id"} = $1
    )
    `;

    const dbResUpdateStockQuery = await pool.query(updateStockQuery, [
      dbResOrderQuery.rows[0].user_id
        ? dbResOrderQuery.rows[0].user_id
        : dbResOrderQuery.rows[0].guest_id,
    ]);

    // console.log(`Stock updated for order ${refno}`);

    //clear item
    const clearCartQuery = `
    DELETE FROM items 
    WHERE ${dbResOrderQuery.rows[0].user_id ? "cart_id" : "guest_cart_id"} = (
        SELECT id FROM ${
          dbResOrderQuery.rows[0].user_id ? "cart_items" : "guest_carts"
        }
    WHERE ${dbResOrderQuery.rows[0].user_id ? "user_id" : "guest_id"} = $1
      )
    `;

    const dbResClearCartQuery = await pool.query(clearCartQuery, [
      dbResOrderQuery.rows[0].user_id
        ? dbResOrderQuery.rows[0].user_id
        : dbResOrderQuery.rows[0].guest_id,
    ]);

    //update cart total
    const updateCartQuery = `
    UPDATE ${dbResOrderQuery.rows[0].user_id ? "cart_items" : "guest_carts"}
    SET 
        total_quantity = 0,
        total_price = 0
    WHERE ${dbResOrderQuery.rows[0].user_id ? "user_id" : "guest_id"} = $1
    `;

    const dbResUpdateCartQuery = await pool.query(updateCartQuery, [
      dbResOrderQuery.rows[0].user_id
        ? dbResOrderQuery.rows[0].user_id
        : dbResOrderQuery.rows[0].guest_id,
    ]);

    // console.log(`Cart cleared for order ${refno}`);

    res.status(200).json({
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default paymentWebhook;
