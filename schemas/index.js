import * as Comment from "./comment";
import * as Post from "./post";
import * as User from "./user";

const types = [];
const inputs = [];
const queries = [];
const mutations = [];

const schemas = [Comment, Post, User];

schemas.forEach(schema => {
  types.push(schema.types);
  inputs.push(schema.inputs);
  queries.push(schema.queries);
  mutations.push(schema.mutations);
});

export default `
${types.join("\n")}

${inputs.join("\n")}

type Query {
  ${queries.join("\n")}
}

type Mutation {
  ${mutations.join("\n")}
}
`;
