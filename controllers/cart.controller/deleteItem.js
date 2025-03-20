import { pool } from "../../database/connectPostgres.js";

const deleteItem = async (req, res) => {
  try {
    const item_id = req.params.id;
    let user_id = req.userId;
    let guest_id = req.cookies.guest_id;
    let cart_id = null;
    let guest_cart_id = null;

    //fetch cart_id or guest_cart_id
    if (user_id) {
      const cartQuery = `
        SELECT id 
        FROM cart_items 
        WHERE user_id = $1
        `;
      const dbResCartQuery = await pool.query(cartQuery, [user_id]);
      cart_id = dbResCartQuery.rows.length ? dbResCartQuery.rows[0].id : null;
    } else if (guest_id) {
      const guestCartQuery = `
        SELECT id 
        FROM guest_carts 
        WHERE guest_id = $1
        `;
      const dbResGuestCartQuery = await pool.query(guestCartQuery, [guest_id]);
      guest_cart_id = dbResGuestCartQuery.rows.length
        ? dbResGuestCartQuery.rows[0].id
        : null;
    }

    if (!cart_id && !guest_cart_id) {
      return res.status(400).json({
        message: "Cart not found",
      });
    }

    //check if item exist in cart
    const itemQuery = `
    SELECT
      i.id, 
      i.product_id,
      i.total_quantity,
      p.quantity AS stock, 
      p.price,
      i.cart_id, 
      i.guest_cart_id
    FROM items i
    JOIN products p ON i.product_id = p.id
    WHERE i.id = $1 AND (i.cart_id = COALESCE($2, i.cart_id) OR i.guest_cart_id = COALESCE($3, i.guest_cart_id))
    `;

    const dbResItemQuery = await pool.query(itemQuery, [
      item_id,
      cart_id,
      guest_cart_id,
    ]);

    if (dbResItemQuery.rows.length === 0) {
      return res.status(400).json({
        message: "Item not found in cart",
      });
    }

    const item = dbResItemQuery.rows[0];

    //delete item
    const deleteItemQuery = `
    DELETE FROM items
    WHERE id = $1
    `;
    const dbResDeleteItemQuery = await pool.query(deleteItemQuery, [item_id]);

    //update cart total
    const updateCartQuery = `
    UPDATE ${user_id ? "cart_items" : "guest_carts"}
    SET 
      total_quantity = (SELECT COALESCE(SUM(total_quantity), 0) FROM items WHERE ${
        user_id ? "cart_id" : "guest_cart_id"
      } = $1),
      total_price = (SELECT COALESCE(SUM(total_quantity * p.price), 0) FROM items i JOIN products p ON i.product_id = p.id WHERE i.${
        user_id ? "cart_id" : "guest_cart_id"
      } = $1)
    WHERE id = $1
    `;

    const dbResUpdateCartQuery = await pool.query(updateCartQuery, [
      user_id ? item.cart_id : item.guest_cart_id,
    ]);

    res.status(200).json({
      message: "Item deleted sucessfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default deleteItem;
