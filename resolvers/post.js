export const nested = {
  creatorPost: ({ creatorPostId }, args, { models }) =>
    models.User.findOne({
      where: { id: creatorPostId }
    }),
  comments: ({ id }, args, { models }) =>
    models.Comment.findAll({
      where: { postId: id }
    })
};

export const queries = {
  getPost: (parent, { input: { creatorPostId } }, { models }) =>
    models.Post.findAll({
      where: { creatorPostId },
      order: [["createdAt", "DESC"]]
    }),
  allPost: (parent, args, { models }) =>
    models.Post.findAll({
      where: args.createdAt,
      order: [["createdAt", "DESC"]]
    })
};

export const mutation = {
  createPost: (parent, { input: { creatorPostId, post } }, { models }) =>
    models.Post.create({ creatorPostId, post })
};
