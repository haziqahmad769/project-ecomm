import { pool } from "../../database/connectPostgres.js";

const profile = async (req, res) => {
  try {
    const userId = req.userId;

    //check user
    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }

    //get user details
    const query = `
    SELECT
        u.id,
        u._id,
        u.name,
        u.email,
        u.address,
        u.phone_number,
        u.is_admin,
        f.path AS profile_image,
        u.created_at,
        u.updated_at
    FROM users u
    LEFT JOIN files f ON u.profile_image = f.id
    WHERE u.id = $1
    `;
    const dbRes = await pool.query(query, [userId]);
    const user = dbRes.rows[0];

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    //construct response
    const response = {
      id: user.id,
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phoneNumber: user.phone_number,
      isAdmin: user.is_admin,
      profileImage: user.profile_image
        ? `${process.env.SERVER_URL}/${user.profile_image}`
        : null,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default profile;
