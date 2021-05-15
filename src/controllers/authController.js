const userModel = require("../models/user");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export const controlRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await userModel.find({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email is already taken",
      });
    }

    const hashedPassword = await bycrpt.hash(password, process.env.SALT_ROUNDS);

    const user = await new userModel({
      email: email,
      password: hashedPassword,
    });

    const registeredUser = await user.save();

    res.send(201).json({
      _id: registeredUser._id,
      email: registeredUser.email,
    });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const controlLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.find({ email });

    if (!user) {
      return res.status(400).json({ error: "User Not Found " });
    }

    const isEqual = await bycrpt.compare(password, user.password);

    if (!isEqual) {
      return res.status(400).json({ error: "Password Not Matched" });
    }

    const token = await jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_WEB_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {});

    res.status(200).json({
      token,
      id: user._id,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
