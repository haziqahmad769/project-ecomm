import { pool } from "../../database/connectPostgres.js";

const deleteAllItems = async (req, res) => {
  try {
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

    //delete all items with same cart_id or guest_cart_id
    const deleteItemsQuery = `
    DELETE FROM items
    WHERE ${user_id ? "cart_id" : "guest_cart_id"} = $1
    `;

    const dbResDeleteItemsQuery = await pool.query(deleteItemsQuery, [
      user_id ? cart_id : guest_cart_id,
    ]);

    //update cart total
    const updateCartQuery = `
    UPDATE ${user_id ? "cart_items" : "guest_carts"}
    SET 
        total_quantity = 0,
        total_price = 0
    WHERE id = $1
    `;

    const dbResUpdateCartQuery = await pool.query(updateCartQuery, [
      user_id ? cart_id : guest_cart_id,
    ]);

    res.status(200).json({
      message: "All items deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default deleteAllItems;
