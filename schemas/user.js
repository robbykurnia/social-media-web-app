export const types = `
type User {
  id: Int!
  username: String!
  email: String!
  createdAt: String!
  updatedAt: String!
  posts: [Post!]!
  somePosts(limit: Int!, cursor:Int): [Post!]!
  comments: [Comment!]!
  likes: [Like!]!
}
`;

export const inputs = `
input SearchUsernameInput {
  username: String!
}

input LoginInput {
  email: String!
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
`;

export const queries = `
  allUser: [User!]!
  getUser(input: GetUserInput!): User!
  me: User
  searchUsername(input: SearchUsernameInput!): [User!]!
`;

export const mutations = `
  createUser(input: CreateUserInput!): User
  updateUser(input: UpdateUserInput!): [Int!]!
  deleteUser(input: DeleteUserInput!): Int!
  register(input: RegisterInput!): User!
  login(input: LoginInput!): String!
`;
