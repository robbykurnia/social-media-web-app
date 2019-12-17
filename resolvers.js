import Sequelize from "sequelize";

const Op = Sequelize.Op;

export default {
  User: {
    posts: ({ id }, args, { models }) =>
      models.Post.findAll({
        where: { creatorPostId: id }
      }),
    comments: ({ id }, args, { models }) =>
      models.Comment.findAll({
        where: { creatorCommentId: id }
      })
  },
  Post: {
    comments: ({ id }, args, { models }) =>
      models.Comment.findAll({
        where: { postId: id }
      })
  },
  Comment: {
    creatorComment: ({ creatorCommentId }, args, { models }) =>
      models.User.findOne({
        where: { id: creatorCommentId }
      })
  },

  Query: {
    allUser: (parent, args, { models }) => models.User.findAll(),
    getUser: (parent, { input: { id } }, { models }) =>
      models.User.findOne({
        where: { id }
      }),
    searchUsername: (parent, { username }, { models }) =>
      models.User.findAll({
        where: { username: { [Op.substring]: username } }
        // ,order: [["username", "DESC"]]
      }),
    getPost: (parent, { creatorPostId }, { models }) => {
      models.Post.findAll({
        where: { creatorPostId }
      });
    },
    allPost: (parent, args, { models }) => models.User.findAll(),
    getComment: (parent, { creatorCommentId }, { models }) => {
      models.Comment.findAll({
        where: { creatorCommentId }
      });
    }
  },

  Mutation: {
    createUser: (
      parent,
      { input: { username, email, password } },
      { models }
    ) => models.User.create({ username, email, password }),

    updateUser: (parent, { input: { id, email, password } }, { models }) =>
      models.User.update({ email, password }, { where: { id } }),

    deleteUser: (parent, { input: { id } }, { models }) =>
      models.User.destroy({ where: { id } }),

    createPost: (parent, { creatorPostId, post }, { models }) =>
      models.Post.create({ creatorPostId, post }),

    createComment: (
      parent,
      { creatorCommentId, postId, comment },
      { models }
    ) => models.Comment.create({ creatorCommentId, postId, comment }),
    login: (parent, { username, password }, { models }) =>
      models.Post.create({ username, password })
  }
};
