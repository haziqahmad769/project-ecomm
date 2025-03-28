import { pool } from "../../database/connectPostgres.js";

const paymentWebhook = async (req, res) => {
  try {
    const {
      order_id, // order_id
      status, // "1" means paid
      amount, // amount paid
    } = req.body;

    // console.log("Webhook received:", req.body);

    //ensure required fields present
    if (!order_id || !status) {
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

    const dbResOrderQuery = await pool.query(orderQuery, [order_id]);

    if (dbResOrderQuery.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found or already paid",
      });
    }

    const order = dbResOrderQuery.rows[0];
    const isGuest = !order.user_id;

    //fetch cart items linked to order
    const cartItemsQuery = `
    SELECT i.id AS item_id, i.product_id, i.total_quantity AS quantity , p.price
    FROM items i
    JOIN products p ON i.product_id = p.id
    WHERE i.${isGuest ? "guest_cart_id" : "cart_id"} = (
        SELECT id FROM ${isGuest ? "guest_carts" : "cart_items"}
        WHERE ${isGuest ? "guest_id" : "user_id"} = $1
    )
    `;

    const dbResCartItemsQuery = await pool.query(cartItemsQuery, [
      isGuest ? order.guest_id : order.user_id,
    ]);

    const orderedProducts = dbResCartItemsQuery.rows;

    if (orderedProducts.length === 0) {
      return res.status(400).json({
        message: "No products found in cart for this order",
      });
    }

    //insert ordered products
    const insertOrderedProductsQuery = `
    INSERT INTO ordered_products (order_id, item_id, product_id, quantity, price)
    VALUES ${orderedProducts
      .map(
        (_, index) =>
          `($1, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4}, $${
            index * 4 + 5
          })`
      )
      .join(", ")}
    `;

    const orderedProductValues = orderedProducts.flatMap(
      ({ item_id, product_id, quantity, price }) => [
        item_id,
        product_id,
        quantity,
        price,
      ]
    );

    const dbResInsertOrderedProductsQuery = await pool.query(
      insertOrderedProductsQuery,
      [order_id, ...orderedProductValues]
    );

    //update order as paid
    const updateOrderQuery = `
    UPDATE orders 
    SET paid = true 
    WHERE id = $1
    `;

    const dbResUpdateOrderQuery = await pool.query(updateOrderQuery, [
      order_id,
    ]);

    // console.log(`Order ${order_id} marked as paid`);

    //update stock
    const updateStockQuery = `
    UPDATE products
    SET quantity = quantity - i.total_quantity
    FROM items i
    WHERE products.id = i.product_id
    AND i.${isGuest ? "guest_cart_id" : "cart_id"} = (
      SELECT id FROM ${isGuest ? "guest_carts" : "cart_items"}
      WHERE ${isGuest ? "guest_id" : "user_id"} = $1
    )
    `;

    const dbResUpdateStockQuery = await pool.query(updateStockQuery, [
      isGuest ? order.guest_id : order.user_id,
    ]);

    // console.log(`Stock updated for order ${order_id}`);

    //clear item
    const clearCartQuery = `
    DELETE FROM items 
    WHERE ${isGuest ? "guest_cart_id" : "cart_id"} = (
        SELECT id FROM ${isGuest ? "guest_carts" : "cart_items"}
    WHERE ${isGuest ? "guest_id" : "user_id"} = $1
      )
    `;

    const dbResClearCartQuery = await pool.query(clearCartQuery, [
      isGuest ? order.guest_id : order.user_id,
    ]);

    //update cart total
    const updateCartQuery = `
    UPDATE ${isGuest ? "guest_carts" : "cart_items"}
    SET 
        total_quantity = 0,
        total_price = 0
    WHERE ${isGuest ? "guest_id" : "user_id"} = $1
    `;

    const dbResUpdateCartQuery = await pool.query(updateCartQuery, [
      isGuest ? order.guest_id : order.user_id,
    ]);

    // console.log(`Cart cleared for order ${order_id}`);

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
