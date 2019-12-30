import _ from "lodash";

import * as User from "./user";
import * as Post from "./post";
import * as Comment from "./comment";

const queries = _.assign({}, User.queries, Post.queries, Comment.queries);
const mutations = _.assign({}, User.mutations, Post.mutation, Comment.mutation);

export default {
  User: User.nested,
  Post: Post.nested,
  Comment: Comment.nested,
  Query: queries,
  Mutation: mutations
};
