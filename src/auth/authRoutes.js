const express = require("express");
const {
  controlRegister,
  controlLogin,
  controlLogout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", controlRegister);

router.post("/login", controlLogin);

router.post("/logout", controlLogout);

export default router;
