import _ from "lodash";

export const allQueries = {
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
  getComment: (parent, { input: { creatorCommentId } }, { models }) =>
    models.Comment.findAll({
      where: { creatorCommentId }
    }),
  allComment: (parent, args, { models }) => models.Comment.findAll()
};

export const user = {
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
    })
};
export const comment = {
  getComment: (parent, { input: { creatorCommentId } }, { models }) =>
    models.Comment.findAll({
      where: { creatorCommentId }
    }),
  allComment: (parent, args, { models }) => models.Comment.findAll()
};

export const queries = _.assign({}, user, post, comment);
