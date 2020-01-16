import express from "express";
import bodyParser from "body-parser";
import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import cors from "cors";
import DataLoader from "dataloader";
import _ from "lodash";
import models from "./models";
import auth from "./middleware/auth";
import typeDefs from "./schemas/index";
import resolvers from "./resolvers/index";
import { batchPosts, someBatchPosts } from "./resolvers/user";
import { batchComments, batchLikes } from "./resolvers/post";

const app = express();
const port = 4000;
const jwtSecretKey = "put your secret key on environment!";
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

app.use(cors());
app.use(auth);

app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress((req, res) => ({
    schema,
    context: {
      models,
      jwtSecretKey,
      req,
      res,
      postLoader: new DataLoader(keys => batchPosts(keys, models)),
      somePostLoader: new DataLoader(keys => someBatchPosts(keys, models)),
      commentLoader: new DataLoader(keys => batchComments(keys, models)),
      likeLoader: new DataLoader(keys => batchLikes(keys, models))
    }
  }))
);

app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

models.sequelize
  .sync()
  .then(() =>
    app.listen(port, () =>
      console.log(
        `
Running a GraphQL API server at http://localhost:${port}/graphql`
      )
    )
  )
  .catch(err => {
    throw err;
  });
