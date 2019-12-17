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

input LoginInput {
  username: String!
  password: String!
}

input RegisterInput {
  username: String!
  email: String!
  password: String!
}

input GetUserInput {
  id: Int
  username: String
  email: String
}

input CreateUserInput {
  username: String!
  password: String!
  email: String!
}

input UpdateUserInput {
  id: Int!
  email: String!
  password: String!
}

input DeleteUserInput {
  id: Int!
}

type Query {
  allUser: [User!]!
  getUser(input: GetUserInput!): User!
  searchUsername(username: String!): [User!]!
  getPost(creatorPostId: Int!): [Post!]!
  allPost: [Post!]!
  getComment(creatorCommentId: Int!): [Comment!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User
  updateUser(input: UpdateUserInput!): [Int!]!
  deleteUser(input: DeleteUserInput!): Int!
  createPost(creatorPostId: Int!, post: String!): Post!
  createComment(postId: Int!, creatorCommentId: Int!, comment: String!): Comment!
  register(input: RegisterInput!): User
  login(input: LoginInput!): User
}
`;
