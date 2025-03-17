import { Router } from "express";
import signup from "../controllers/auth.controller/signup.js";
import login from "../controllers/auth.controller/login.js";
import logout from "../controllers/auth.controller/logout.js";
import isAuth from "../middlewares/isAuth.js";
import profile from "../controllers/auth.controller/profile.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/profile", isAuth, profile);

export default authRouter;
