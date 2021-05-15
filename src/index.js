const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { graphqlHTTP } = require("express-graphql");
import cookieParser from "cookie-parser";
const isAuth = require("./middleware/is-auth");
import authRouter from "./auth/authRoutes";
const graphqlSchema = require("./graphql/schema/index");
const graphqlResolvers = require("./graphql/resolvers/index");

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(isAuth);

app.get(
  "/playground",
  expressPlayground({
    endpoint: "/graphql",
    subscriptionEndpoint: "/graphql",
  })
);

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
