import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

export const nested = {
  // posts: ({ id }, args, { models }) =>
  //   models.Post.findAll({
  //     where: { creatorPostId: id }
  //   }),
  // posts yang bener yg bawah
  posts: ({ id }, args, { postLoader }) => postLoader.load(id),
  somePosts: ({ id }, { limit, cursor }, { somePostLoader }) =>
    somePostLoader.load({ id, limit, cursor }),
  comments: ({ id }, args, { models }) =>
    models.Comment.findAll({
      where: { creatorCommentId: id }
    }),
  likes: ({ id }, args, { models }) =>
    models.Like.findAll({
      where: { creatorLikesId: id }
    })
  // comments: ({ id }, args, { commentLoader }) => commentLoader.load(id)
};

export const someBatchPosts = async (keys, { Post }) => {
  console.log("\n\nkeys atas :", keys, "\n\n\n");

  const cursor = keys[0].cursor;
  const limit = keys[0].limit;
  keys = [keys[0].id];
  // problem
  // 1. firstCall === true -> call query without cursor
  // 2. (cursor === true) = not firstCall
  const posts = await Post.findAll({
    limit,
    raw: true,
    where: {
      [Op.and]: [
        {
          creatorPostId: {
            [Op.in]: keys
          }
        },
        { id: { [Op.lt]: cursor } }
      ]
    },
    order: [["id", "DESC"]]
  });

  if (!cursor) {
    const firstPosts = await Post.findAll({
      limit,
      raw: true,
      where: {
        creatorPostId: {
          [Op.in]: keys
        }
      },
      order: [["id", "DESC"]]
    });

    const groupPosts = _.groupBy(firstPosts, "creatorPostId");
    return keys.map(key => groupPosts[key] || []);
  }

  const groupPosts = _.groupBy(posts, "creatorPostId");
  return keys.map(key => groupPosts[key] || []);
};

export const batchPosts = async (keys, { Post }) => {
  const posts = await Post.findAll({
    raw: true,
    where: {
      creatorPostId: {
        [Op.in]: keys
      }
    }
  });

  const groupPosts = _.groupBy(posts, "creatorPostId");
  return keys.map(key => groupPosts[key] || []);
};

export const queries = {
  allUser: (parent, args, { models }) => models.User.findAll(),
  getUser: (parent, { input: { username } }, { models }) =>
    models.User.findOne({
      where: { username }
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
      where: { username: { [Op.regexp]: username } }
      // where: { username: { [Op.substring]: username } }
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
    const isEmail = await models.User.findOne({
      where: { email },
      attributes: ["email"]
    });
    if (isEmail) {
      throw new Error("Email already used");
    }

    const isUsername = await models.User.findOne({
      where: { username },
      attributes: ["username"]
    });
    if (isUsername) {
      throw new Error("Username already used");
    }

    password = await bcrypt.hash(password, 12);
    return models.User.create({ username, email, password });
  },
  login: async (
    parent,
    { input: { email, password } },
    { models, jwtSecretKey }
  ) => {
    const user = await models.User.findOne({
      where: { email }
    });
    if (!user) {
      throw new Error("Invalid Email or Password");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Invalid Email or Password");
    }

    const token = jwt.sign(
      { user: _.pick(user, ["id", "username", "email"]) },
      jwtSecretKey,
      { expiresIn: "1y" }
    );

    // return token;

    const data = ` ${token} ${user.username} ${user.email} `;
    // const testData = data.split(" ");
    // console.log(testData[0]);

    return data;
  }
};
