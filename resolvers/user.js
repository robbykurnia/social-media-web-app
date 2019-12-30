import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

export const nested = {
  posts: ({ id }, args, { models }) =>
    models.Post.findAll({
      where: { creatorPostId: id }
    }),
  comments: ({ id }, args, { models }) =>
    models.Comment.findAll({
      where: { creatorCommentId: id }
    })
};

export const queries = {
  allUser: (parent, args, { models }) => models.User.findAll(),
  getUser: (parent, { input: { id } }, { models }) =>
    models.User.findOne({
      where: { id }
    }),
  me: (parent, args, { models, req }) => {
    if (!req.isAuth) {
      throw new Error("Invalid Token");
    }

    const { user } = req;
    if (user) {
      return models.User.findOne({ where: { id: user.id } });
    } else {
      return null;
    }
  },
  searchUsername: (parent, { input: { username } }, { models }) =>
    models.User.findAll({
      where: { username: { [Op.substring]: username } }
      // ,order: [["username", "DESC"]]
    })
};

export const mutations = {
  createUser: (parent, { input: { username, email, password } }, { models }) =>
    models.User.create({ username, email, password }),

  updateUser: (parent, { input: { id, email, password } }, { models }) =>
    models.User.update({ email, password }, { where: { id } }),

  deleteUser: (parent, { input: { id } }, { models }) =>
    models.User.destroy({ where: { id } }),
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
    { input: { email, password } },
    { models, jwtSecretKey, res }
  ) => {
    const user = await models.User.findOne({
      where: { email }
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
};
