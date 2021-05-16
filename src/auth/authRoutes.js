import express from "express";
import {
  controlRegister,
  controlLogin,
  controlLogout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", controlRegister);

router.post("/login", controlLogin);

router.post("/logout", controlLogout);

export default router;
