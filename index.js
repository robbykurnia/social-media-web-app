import express from "express";
import bodyParser from "body-parser";
import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import cors from "cors";
import auth from "./middleware/auth";
import typeDefs from "./schemas/index";
import resolvers from "./resolvers/index";
import models from "./models";

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
    context: { models, jwtSecretKey, req, res }
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
