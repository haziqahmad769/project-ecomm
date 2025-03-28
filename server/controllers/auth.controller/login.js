import { pool } from "../../database/connectPostgres.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //email & password requires
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    //check user
    const checkUserQuery = `
        SELECT *
        FROM users
        WHERE email = $1
        `;

    const dbResCheckUserQuery = await pool.query(checkUserQuery, [email]);
    const user = dbResCheckUserQuery.rows[0];

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    //check password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }

    //create token
    const data = {
      id: user.id,
      email: user.email,
    };

    const secretKey = process.env.JWT_SECRET_KEY;

    const token = jwt.sign(data, secretKey, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true, // Prevent access by JavaScript
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "lax", // Adjust based on your cross-origin needs
      path: "/", // Ensure it matches
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
    });

    res.status(200).json({
      message: "Login successfully",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default login;
