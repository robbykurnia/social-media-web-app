import isAuth from "./isAuth";
import _ from "lodash";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

export const nested = {
  creatorPost: ({ creatorPostId }, args, { models }) =>
    models.User.findOne({
      where: { id: creatorPostId }
    }),
  comments: ({ id }, args, { commentLoader }) => commentLoader.load(id),
  likes: ({ id }, args, { likeLoader }) => likeLoader.load(id)
  // comments: ({ id }, args, { models }) =>
  //   models.Comment.findAll({
  //     where: { creatorCommentId: id }
  //   })
};

export const batchComments = async (keys, { Comment }) => {
  const comments = await Comment.findAll({
    raw: true,
    where: {
      postId: {
        [Op.in]: keys
      }
    }
  });

  const groupComments = _.groupBy(comments, "postId");
  return keys.map(key => groupComments[key] || []);
};

export const batchLikes = async (keys, { Like }) => {
  const likes = await Like.findAll({
    raw: true,
    where: {
      postId: {
        [Op.in]: keys
      }
    }
  });

  const groupLikes = _.groupBy(likes, "postId");
  return keys.map(key => groupLikes[key] || []);
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
    }),
  getSelectedPost: async (parent, args, { models }) => {
    if (!args.input.cursor) {
      const posts = await models.Post.findAll({
        limit: args.input.limit,
        // where: args.createdAt,

        // for following user
        // where: { creatorPostId: { [Op.in]: [9, 10] } },
        order: [["createdAt", "DESC"]]
      });
      return posts;
    }
    if (args.input.cursor) {
      const posts = await models.Post.findAll({
        limit: args.input.limit,
        // where: args.createdAt,

        // for following user
        // where: { creatorPostId: { [Op.in]: [9, 10] } },

        // for following user with cursor
        // where: {
        //   [Op.and]: [
        //     { creatorPostId: { [Op.in]: [9, 10] } },
        //     { id: { [Op.lt]: args.input.cursor } }
        //   ]
        // },
        where: { id: { [Op.lt]: args.input.cursor } },
        order: [["createdAt", "DESC"]]
      });
      return posts;
    }
  }
};

export const mutation = {
  createPost: (parent, { input: { creatorPostId, post } }, { models, req }) => {
    isAuth(req);
    return models.Post.create({ creatorPostId, post });
  },
  updatePost: (parent, { input: { id, post } }, { models, req }) => {
    isAuth(req);
    return models.Post.update({ post }, { where: { id } });
  },

  deletePost: (parent, { input: { id } }, { models, req }) => {
    isAuth(req);
    return models.Post.destroy({ where: { id } });
  }
};
