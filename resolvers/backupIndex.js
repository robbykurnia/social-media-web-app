import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";
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
    me: (parent, args, { models, user }) => {
      if (user) {
        return models.User.findOne({ where: { id: user.id } });
      } else {
        return null;
      }
    },
    searchUsername: (parent, { username }, { models }) =>
      models.User.findAll({
        where: { username: { [Op.substring]: username } }
        // ,order: [["username", "DESC"]]
      }),
    getPost: (parent, { input: { creatorPostId } }, { models }) =>
      models.Post.findAll({
        where: { creatorPostId },
        order: [["createdAt", "DESC"]]
      }),
    allPost: (parent, args, { models }) =>
      models.Post.findAll({
        where: args.createdAt,
        order: [["createdAt", "DESC"]]
      }),
    getComment: (parent, { input: { creatorCommentId } }, { models }) =>
      models.Comment.findAll({
        where: { creatorCommentId }
      }),
    allComment: (parent, args, { models }) => models.Comment.findAll()
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

    createPost: (parent, { input: { creatorPostId, post } }, { models }) =>
      models.Post.create({ creatorPostId, post }),

    createComment: (
      parent,
      { input: { creatorCommentId, postId, comment } },
      { models, user }
    ) => models.Comment.create({ creatorCommentId, postId, comment }),
    register: async (
      parent,
      { input: { username, email, password } },
      { models }
    ) => {
      const isUsername = await models.User.findOne({
        where: { username },
        attributes: ["username"]
      });
      if (isUsername) {
        throw new Error("Username already used");
      }

      const isEmail = await models.User.findOne({
        where: { email },
        attributes: ["email"]
      });
      if (isEmail) {
        throw new Error("Email already used");
      }

      password = await bcrypt.hash(password, 12);
      return models.User.create({ username, email, password });
    },
    login: async (
      parent,
      { input: { username, password } },
      { models, jwtSecretKey }
    ) => {
      const user = await models.User.findOne({
        where: { username }
      });
      if (!user) {
        throw new Error("Invalid Username or Password");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error("Invalid Username or Password");
      }

      const token = jwt.sign(
        { user: _.pick(user, ["id", "username", "email"]) },
        jwtSecretKey,
        { expiresIn: "1h" }
      );
      return token;
    }
  }
};
