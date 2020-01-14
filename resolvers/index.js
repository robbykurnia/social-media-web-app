import _ from "lodash";

import * as User from "./user";
import * as Post from "./post";
import * as Comment from "./comment";
import * as Like from "./like";

const queries = _.assign(
  {},
  User.queries,
  Post.queries,
  Comment.queries,
  Like.queries
);
const mutations = _.assign(
  {},
  User.mutations,
  Post.mutation,
  Comment.mutation,
  Like.mutation
);

export default {
  User: User.nested,
  Post: Post.nested,
  Comment: Comment.nested,
  Like: Like.nested,
  Query: queries,
  Mutation: mutations
};
