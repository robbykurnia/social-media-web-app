export const types = `
type Comment {
  id: Int!
  comment: String!
  createdAt: String!
  updatedAt: String!
  postId: Int!
  creatorCommentId: Int!
  creatorComment: User!
}
`;

export const inputs = `
input GetCommentInput {
  creatorCommentId: Int!
}

input CreateCommentInput {
  postId: Int!
  creatorCommentId: Int!
  comment: String!
}
`;

export const queries = `
  getComment(input: GetCommentInput!): [Comment!]!
  allComment: [Comment!]!
`;

export const mutations = `
  createComment(input: CreateCommentInput!): Comment!
`;
