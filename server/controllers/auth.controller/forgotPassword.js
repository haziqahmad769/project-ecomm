import { pool } from "../../database/connectPostgres.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // check user
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

    // send reset password email
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);

    const resetLink = `${process.env.WEB_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: `
                <p>Hi ${user.name},</p>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetLink}" target="_blank">${resetLink}</a>
              `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Check your email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default forgetPassword;
