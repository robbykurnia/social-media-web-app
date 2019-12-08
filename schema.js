export default `
type Comment {
  id: Int!
  comment: String!
  postId: Int!
  creatorCommentId: Int!
  creatorComment: User!
}

type Post {
  id: Int!
  post: String!
  creatorPostId: Int!
  comments: [Comment!]!
}

type User {
  id: Int!
  username: String!
  email: String!
  createdAt: String!
  UpdatedAt: String!
  posts: [Post!]!
  comments: [Comment!]!
}

input GetUserInput {
  id: Int
  username: String
  email: String
}

input CreateUserInput {
  username: String!
  email: String!
}

input UpdateUserInput {
  id: Int!
  email: String!
}

input DeleteUserInput {
  id: Int!
}

type Query {
  allUser: [User!]!
  getUser(input: GetUserInput!): User!
  searchUsername(username: String!): [User!]!
  getUserPost(creatorPostId: Int!): [Post!]!
  getUserComment(creatorCommentId: Int!): [Comment!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User
  updateUser(input: UpdateUserInput!): [Int!]!
  deleteUser(input: DeleteUserInput!): Int!
  createUserPost(creatorPostId: Int!, post: String!): Post!
  createUserComment(postId: Int!, creatorCommentId: Int!, comment: String!): Comment!
}
`;
