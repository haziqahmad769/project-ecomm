import { pool } from "../../database/connectPostgres.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    // confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Your confirm password is incorrect",
      });
    }

    // update new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatePasswordQuery = `
    UPDATE users 
    SET password = $1 
    WHERE id = $2
    `;
    const dbResUpdatePasswordQuery = await pool.query(updatePasswordQuery, [
      hashedPassword,
      userId,
    ]);

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default resetPassword;
