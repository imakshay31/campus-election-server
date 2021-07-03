import UserModel from "../models/user";
import * as express from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";

export const salt = bcrypt.genSaltSync(4);

export const controlRegister = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password } = req.body;

    console.log(email);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await new UserModel({
      email: email,
      password: hashedPassword,
      id: uuidv4(),
    });

    const registeredUser = await user.save();

    const token = await jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_WEB_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.send(201).json({
      token,
      user: {
        _id: registeredUser._id,
        email: registeredUser.email,
      },
    });
  } catch (err) {
    //console.log(err);
    return res.status(500).json({
      error: "Email is already taken",
    });
  }
};

export const controlLogin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User Not Found " });
    }

    const isEqual = bcrypt.compareSync(password, user.password);

    if (!isEqual) {
      return res.status(400).json({ error: "Password Not Matched" });
    }

    const token = await jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_WEB_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const _id = user._id;
    console.log(token);
    res.status(200).json({
      token,
      user: {
        _id,
        email,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const controlLogout = async (
  req: express.Request,
  res: express.Response
) => {
  res
    .cookie("token", "", {
      expires: new Date(0),
    })
    .send("Logged Out");
};

export const checkLoginStatus = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const token = await req.cookies.jwt;

    console.log("working 1");
    console.log(token);
    if (!token)
      res.status(201).json({
        isLoggedIn: false,
      });
    console.log("working 2");
    // const verify = await jwt.verify(token, process.env.JWT_WEB_TOKEN_SECRET);
    res.status(200).json({
      isLoggedIn: true,
      //_id: verify._id,
    });
  } catch (err) {
    console.log(err);
    res.json({ isLoggedIn: false });
  }
};
