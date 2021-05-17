import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import cookieParser from "cookie-parser";
import authRouter from "./auth/authRoutes.js";
import graphqlSchema from "./graphql/schema/index.js";
import graphqlResolvers from "./graphql/resolvers/index.js";
import jwt from "jsonwebtoken";

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api", authRouter);

app.use("/graphql", async (req, res) => {
  const token = await req.cookies.token;

  if (token) {
    const user = await jwt.verify(token, process.env.JWT_WEB_TOKEN_SECRET);
    req.userId = user._id;
  }

  return graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })(req, res);
});

mongoose
  .connect(process.env.DB_URL, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database Connect");
    app.listen(PORT, () => {
      console.log(`Listing on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database NOT FOUND !!");
    console.log(err);
  });
