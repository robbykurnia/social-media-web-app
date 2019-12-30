export const types = `
type Post {
  id: Int!
  post: String!
  createdAt: String!
  updatedAt: String!
  creatorPostId: Int!
  creatorPost: User!
  comments: [Comment!]!
}
`;

export const inputs = `
input GetPostInput {
  creatorPostId: Int!
}

input CreatePostInput {
  creatorPostId: Int!
  post: String!
}
`;

export const queries = `
  getPost(input: GetPostInput!): [Post!]!
  allPost: [Post!]!
`;

export const mutations = `
  createPost(input: CreatePostInput!): Post!
`;
