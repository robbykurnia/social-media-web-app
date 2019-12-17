import express from "express";
import bodyParser from "body-parser";
import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import models from "./models";

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Initialize the app
const app = express();
const port = 4000;

// The GraphQL endpoint
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({ schema, context: { models } })
);

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Start the server
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
  .catch(err => console.log("Error Massage:" + err));
