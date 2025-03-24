import { pool } from "../../database/connectPostgres.js";
import axios from "axios";
import crypto from "crypto";

const initiatePayment = async (req, res) => {
  try {
    //create bill via toyyibpay
    //returns payment url
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

    //prevent guest from creating multiple unpaid orders
    if (!user_id) {
      const unpaidOrderQuery = `
        SELECT id 
        FROM orders 
        WHERE guest_id = $1 AND paid = false
        `;
      const dbResUnpaidOrderQuery = await pool.query(unpaidOrderQuery, [
        guest_id,
      ]);

      if (dbResUnpaidOrderQuery.rows.length > 0) {
        return res.status(400).json({
          message: "You have an unpaid order. Please complete payment first",
        });
      }
    }

    //fetch total price
    const totalPriceQuery = `
    SELECT COALESCE(SUM(i.total_quantity * p.price), 0) AS total_price
    FROM items i JOIN products p ON i.product_id = p.id
    WHERE i.${user_id ? "cart_id" : "guest_cart_id"} = $1
      `;

    const dbResTotalPriceQuery = await pool.query(totalPriceQuery, [
      user_id ? cart_id : guest_cart_id,
    ]);
    const totalPrice = parseFloat(
      dbResTotalPriceQuery.rows[0].total_price
    ).toFixed(2);

    if (totalPrice <= 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    //check stock
    const checkStockQuery = `
    SELECT p.id, p.name, p.quantity, i.total_quantity
    FROM products p
    JOIN items i ON p.id = i.product_id
    WHERE i.${user_id ? "cart_id" : "guest_cart_id"} = (
        SELECT id FROM ${user_id ? "cart_items" : "guest_carts"}
        WHERE ${user_id ? "user_id" : "guest_id"} = $1
    )
    AND p.quantity < i.total_quantity
    `;

    const dbResCheckStockQuery = await pool.query(checkStockQuery, [
      user_id ? user_id : guest_id,
    ]);

    // console.log(dbResCheckStockQuery.rows);

    if (dbResCheckStockQuery.rows.length > 0) {
      return res.status(400).json({
        message: "Some items are out of stock",
        outOfStockItems: dbResCheckStockQuery.rows.map((row) => ({
          productName: row.name,
          available: row.quantity,
          requested: row.total_quantity,
        })),
      });
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

    const billDescritption = cartItems
      .map(
        (item) =>
          `${item.name} X ${item.total_quantity} - RM ${parseFloat(
            item.total_price
          ).toFixed(2)}`
      )
      .join("\n");

    //get user / guest details
    let name, email, address, phoneNumber;
    if (user_id) {
      const userQuery = `
        SELECT name, email, address, phone_number
        FROM users 
        WHERE id = $1
        `;
      const dbResUserQuery = await pool.query(userQuery, [user_id]);

      ({ name, email, address } = dbResUserQuery.rows[0]);
      phoneNumber = dbResUserQuery.rows[0].phone_number;
    } else {
      //guest details
      ({ name, email, address, phoneNumber } = req.body);

      if (!name || !email || !address || !phoneNumber) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      //validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email" });
      }
    }

    //insert order in database
    const _id = crypto.randomBytes(16).toString("hex");

    const orderInsertQuery = `
    INSERT INTO orders (_id, user_id, guest_id, name, email, address, phone_number, total_amount, paid)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)
    RETURNING id
    `;

    const dbResOrderInsertQuery = await pool.query(orderInsertQuery, [
      _id,
      user_id,
      guest_id,
      name,
      email,
      address,
      phoneNumber,
      totalPrice,
    ]);

    const order_id = dbResOrderInsertQuery.rows[0].id;

    //create bill in toyyibpay
    const TOYYIBPAY_URL = process.env.TOYYIBPAY_URL;
    const TOYYIBPAY_SECRET_KEY = process.env.TOYYIBPAY_SECRET_KEY;
    const TOYYIBPAY_CATEGORY_ID = process.env.TOYYIBPAY_CATEGORY_ID;

    const response = await axios.post(
      `${TOYYIBPAY_URL}/index.php/api/createBill`,
      new URLSearchParams({
        userSecretKey: TOYYIBPAY_SECRET_KEY,
        categoryCode: TOYYIBPAY_CATEGORY_ID,
        billName: "E-Commerce Purchase",
        billDescription: billDescritption,
        billPriceSetting: 1,
        billPayorInfo: 1,
        billAmount: totalPrice * 100, // convert to cents
        // billReturnUrl: `${process.env.CLIENT_URL}/payment-success`,
        // billCallbackUrl: `${process.env.SERVER_URL}/payments/webhook`,
        billExternalReferenceNo: order_id,
        billTo: name,
        billEmail: email,
        billPhone: phoneNumber,
      })
    );

    const billCode = response.data[0].BillCode;
    res.json({ paymentUrl: `${TOYYIBPAY_URL}/${billCode}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default initiatePayment;
