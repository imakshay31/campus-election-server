import express from "express";
import {
  controlRegister,
  controlLogin,
  controlLogout,
  checkLoginStatus,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", controlRegister);

router.post("/login", controlLogin);

router.post("/logout", controlLogout);

router.post("/isloggedin", checkLoginStatus);

export default router;
