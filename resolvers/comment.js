import isAuth from "./isAuth";

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
    { models, req }
  ) => {
    isAuth(req);
    return models.Comment.create({ creatorCommentId, postId, comment });
  },

  updateComment: (parent, { input: { id, comment } }, { models, req }) => {
    isAuth(req);
    return models.Comment.update({ comment }, { where: { id } });
  },

  deleteComment: (parent, { input: { id } }, { models, req }) => {
    isAuth(req);
    return models.Comment.destroy({ where: { id } });
  }
};
