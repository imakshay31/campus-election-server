import express from "express";
import mongoose from "mongoose";
import env from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import authRouter from "./auth/authRoutes";
import User, { User as UserClass } from "./models/user";
import { buildSchema } from "type-graphql";
import UserQuery from "./graphql/resolvers/query/query";
import UserMutation from "./graphql/resolvers/mutation/mutation";
import { graphqlHTTP } from "express-graphql";
import expressPlayground from "graphql-playground-middleware-express";

env.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 8080;

export interface Context {
  user?: UserClass;
}

app.use("/api", authRouter);

const schema = buildSchema({
  validate: false,
  resolvers: [UserQuery, UserMutation],
  dateScalarMode: "timestamp",
});

app.use(
  "/graphql",

  async (req, res, next) => {
    const header = req.get("authorization");
    let user: UserClass | null = null;

    const token = header ? header.split(" ")[1] : undefined;

    if (token) {
      try {
        const u: any = jwt.verify(token, process.env.JWT_WEB_TOKEN_SECRET);
        user = await User.findOne({ _id: u._id });
        user.password = "";
        console.log(user);
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
        return null;
      }
    }

    const resolvedSchema = await schema;

    return graphqlHTTP({
      schema: resolvedSchema,
      context: {
        user,
      },
    })(req, res);
  }
);

app.get(
  "/playground",
  expressPlayground({
    endpoint: "/graphql",
    subscriptionEndpoint: "/graphql",
  })
);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database Connect");
    app.listen(PORT, async () => {
      console.log(`listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database NOT FOUND !!");
    console.error(error);
  });
