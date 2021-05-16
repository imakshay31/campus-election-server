import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const controlRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email);
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email is already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

    const user = await new UserModel({
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
  }
};

export const controlLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User Not Found " });
    }

    const isEqual = await bcrypt.compare(password, user.password);

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
  }
};
