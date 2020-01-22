export const types = `
type Post {
  id: Int!
  post: String!
  createdAt: String!
  updatedAt: String!
  creatorPostId: Int!
  creatorPost: User!
  comments: [Comment!]!
  likes: [Like!]!
}
`;

export const inputs = `

input GetSelectedPost {
  limit: Int! 
  cursor:Int
}

input GetPostInput {
  creatorPostId: Int!
}

input CreatePostInput {
  creatorPostId: Int!
  post: String!
}

input UpdatePostInput {
  id: Int!
  post: String!
}

input DeletePostInput {
  id: Int!
}
`;

export const queries = `
  getSelectedPost(input: GetSelectedPost!): [Post!]!
  getPost(input: GetPostInput!): [Post!]!
  allPost: [Post!]!
`;

export const mutations = `
  createPost(input: CreatePostInput!): Post!
  updatePost(input: UpdatePostInput!): Post!
  deletePost(input: DeletePostInput!): Int!
`;
