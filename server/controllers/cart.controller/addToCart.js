import { pool } from "../../database/connectPostgres.js";
import { v4 as uuidv4 } from "uuid";

const addToCart = async (req, res) => {
  try {
    //check if user or guest cart items already available
    //create new cart items if not available
    //insert product in items
    //insert items in cart items, if not in new created cart items
    const { product_id, quantity } = req.body;
    let user_id = req.userId; // logged in user id
    let guest_id = req.cookies.guest_id; // guest id from cookies
    let cart_id = null;
    let guest_cart_id = null;

    const parsedQuantity = parseInt(quantity, 10);

    //generate guest_id if not exists
    if (!user_id && !guest_id) {
      guest_id = uuidv4();
      res.cookie("guest_id", guest_id, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        sameSite: "None", // ✅ required for cross-site cookies
        secure: true, // ✅ required when sameSite is "None"
        // path: "/", // Add this to ensure the cookie is available across all paths
      });
    }

    //check product avilability
    const productQuery = `
    SELECT quantity, price 
    FROM products 
    WHERE id = $1
    `;

    const dbResproductQuery = await pool.query(productQuery, [product_id]);
    const product = dbResproductQuery.rows[0];

    if (!product) {
      return res.status(400).json({
        message: "Product not found",
      });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({
        message: "Not enough stock available",
      });
    }

    //check if user has a cart
    if (user_id) {
      const cartQuery = `
        SELECT id
        FROM cart_items
        WHERE user_id = $1
        `;
      const dbResCartQuery = await pool.query(cartQuery, [user_id]);

      if (dbResCartQuery.rows.length) {
        cart_id = dbResCartQuery.rows[0].id;
      } else {
        //create new cart if not exist
        const newCartQuery = `
            INSERT INTO cart_items (user_id)
            VALUES ($1)
            RETURNING id
            `;

        const dbResNewCartQuery = await pool.query(newCartQuery, [user_id]);
        cart_id = dbResNewCartQuery.rows[0].id;
      }
    } else {
      //handle guest cart
      const guestCartQuery = `
        SELECT id
        FROM guest_carts
        WHERE guest_id = $1
        `;
      const dbResGuestCartQuery = await pool.query(guestCartQuery, [guest_id]);

      if (dbResGuestCartQuery.rows.length) {
        guest_cart_id = dbResGuestCartQuery.rows[0].id;
      } else {
        //create guest cart if not exist
        const newGuestCartQuery = `
            INSERT INTO guest_carts (guest_id)
            VALUES ($1)
            RETURNING id
        `;

        const dbResNewGuestCartQuery = await pool.query(newGuestCartQuery, [
          guest_id,
        ]);
        guest_cart_id = dbResNewGuestCartQuery.rows[0].id;
      }
    }

    //ensure cart_id & guest_cart_id set
    if (!cart_id && !guest_cart_id) {
      return res.status(500).json({
        message: "Failed to create or retrieve cart",
      });
    }

    //check if product already in cart
    const itemQuery = `
    SELECT id, total_quantity
    FROM items
    WHERE (cart_id = $1 OR guest_cart_id = $2) AND product_id = $3
    `;

    const dbResItemQuery = await pool.query(itemQuery, [
      cart_id,
      guest_cart_id,
      product_id,
    ]);

    if (dbResItemQuery.rows.length > 0) {
      //update quantity if product exist
      const existingItem = dbResItemQuery.rows[0];
      const newQuantity = existingItem.total_quantity + parsedQuantity;

      if (newQuantity > product.quantity) {
        return res.status(400).json({
          message: "Not enough stock available",
        });
      }

      const updateItemQuery = `
        UPDATE items
        SET total_quantity = $1, total_price = $2
        WHERE id = $3
        `;

      const dbResUpdateItemQuery = await pool.query(updateItemQuery, [
        newQuantity,
        product.price * newQuantity,
        dbResItemQuery.rows[0].id,
      ]);
    } else {
      //insert new item
      const insertItemQuery = `
        INSERT INTO items (cart_id, guest_cart_id, product_id, total_quantity, total_price)
        VALUES ($1, $2, $3, $4, $5)
        `;

      const dbResInsertItemQuery = await pool.query(insertItemQuery, [
        cart_id,
        guest_cart_id,
        product_id,
        parsedQuantity,
        product.price * parsedQuantity,
      ]);
    }

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
      user_id ? cart_id : guest_cart_id,
    ]);
    const cart = dbResUpdateCartQuery.rows[0];

    res.status(200).json({
      message: "Item added to cart successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default addToCart;
