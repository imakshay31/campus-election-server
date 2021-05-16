import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import cookieParser from "cookie-parser";
import isAuth from "./middleware/is-auth.js";
import authRouter from "./auth/authRoutes.js";
import graphqlSchema from "./graphql/schema/index.js";
import graphqlResolvers from "./graphql/resolvers/index.js";

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(isAuth);

app.use("/api", authRouter);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

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
