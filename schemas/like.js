export const types = `
type Like {
  id: Int!
  like: Boolean!
  createdAt: String!
  updatedAt: String!
  postId: Int!
  creatorLikesId: Int!
  creatorLike: User!
}
`;

export const inputs = `
input UpdateOrCreateLikeInput {
    like: Boolean!
    postId: Int!
    creatorLikesId: Int!
}

input GetLikeInput {
  creatorLikesId: Int!
}

input CreateLikeInput {
  postId: Int!
  creatorLikesId: Int!
  like: Boolean!
}

input UpdateLikeInput {
  id: Int!
  like: Boolean!
}

input DeleteLikeInput {
  id: Int!
}
`;

export const queries = `
  getLike(input: GetLikeInput!): [Like!]!
  allLike: [Like!]!
`;

export const mutations = `
  updateOrCreateLike(input: UpdateOrCreateLikeInput!): Like!
  createLike(input: CreateLikeInput!): Like!
  updateLike(input: UpdateLikeInput!): Like!
  deleteLike(input: DeleteLikeInput!): Int!
`;
