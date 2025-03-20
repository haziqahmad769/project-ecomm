import { pool } from "../../database/connectPostgres.js";

const getCartItems = async (req, res) => {
  try {
    let user_id = req.userId;
    let guest_id = req.cookies.guest_id;
    let cart_id = null;
    let guest_cart_id = null;

    //get cart details
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

    //get cart items with product details
    const cartItemsQuery = `
    SELECT
        i.id AS item_id,
        i.total_quantity,
        i.total_price,
        p.id AS product_id,
        p._id,
        p.name,
        p.price,
        f.path AS product_image
    FROM items i
    JOIN products p ON i.product_id = p.id
    LEFT JOIN files f ON p.product_image = f.id
    WHERE i.${user_id ? "cart_id" : "guest_cart_id"} = $1
    `;

    const dbResCartItemsQuery = await pool.query(cartItemsQuery, [
      user_id ? cart_id : guest_cart_id,
    ]);

    const cartItems = dbResCartItemsQuery.rows;

    //construct response
    const response = {
      cartId: cart_id || guest_cart_id,
      userId: user_id || guest_id,
      totalQuantity: cartItems.reduce(
        (acc, item) => acc + item.total_quantity,
        0
      ),
      totalPrice: cartItems
        .reduce((acc, item) => acc + parseFloat(item.total_price || 0), 0)
        .toFixed(2),
      items: cartItems.map((item) => ({
        id: item.item_id,
        product: {
          id: item.product_id,
          _id: item._id,
          name: item.name,
          price: parseFloat(item.price),
          productImage: item.product_image
            ? `${process.env.SERVER_URL}/${item.product_image}`
            : null,
        },
        quantity: item.total_quantity,
        totalPrice: parseFloat(item.total_price).toFixed(2),
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getCartItems;
