export const nested = {
  creatorComment: ({ creatorCommentId }, args, { models }) =>
    models.User.findOne({
      where: { id: creatorCommentId }
    })
};
export const queries = {
  getComment: (parent, { input: { creatorCommentId } }, { models }) =>
    models.Comment.findAll({
      where: { creatorCommentId }
    }),
  allComment: (parent, args, { models }) => models.Comment.findAll()
};

export const mutation = {
  createComment: (
    parent,
    { input: { creatorCommentId, postId, comment } },
    { models, user }
  ) => models.Comment.create({ creatorCommentId, postId, comment })
};
