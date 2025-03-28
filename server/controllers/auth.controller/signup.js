import { pool } from "../../database/connectPostgres.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //name, email & password required
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    //validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    //verify email is not taken
    const checkEmailQuery = `
    SELECT *
    FROM users
    WHERE email = $1
    `;

    const dbResCheckEmailQuery = await pool.query(checkEmailQuery, [email]);

    //console.log(dbResCheckEmailQuery);
    if (dbResCheckEmailQuery.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    //generate unique _id
    const _id = crypto.randomBytes(16).toString("hex");

    //insert new user
    const newUser = `
    INSERT INTO users (_id, name, email, password)
    VALUES ($1, $2, $3, $4)
    `;
    
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const dbResNewUser = await pool.query(newUser, [
      _id,
      name,
      email,
      hashedPassword,
    ]);

    res.status(200).json({
      succes: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default signup;
