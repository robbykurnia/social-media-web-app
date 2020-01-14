import isAuth from "./isAuth";

export const nested = {
  creatorLike: ({ creatorLikesId }, args, { models }) =>
    models.User.findOne({
      where: { id: creatorLikesId }
    })
};
export const queries = {
  getLike: (parent, { input: { creatorLikesId } }, { models }) =>
    models.Like.findAll({
      where: { creatorLikesId }
    }),
  allLike: (parent, args, { models }) => models.Like.findAll()
};

export const mutation = {
  updateOrCreateLike: async (
    parent,
    { input: { like, postId, creatorLikesId } },
    { models, req }
  ) => {
    isAuth(req);
    // models.Like.findOne({
    //   where: { postId, creatorLikesId }
    // }).then(res => {
    //   if (res) {
    //     models.Like.update({ like }, { where: { postId, creatorLikesId } });
    //   } else {
    //     models.Like.create({ creatorLikesId, postId, like });
    //   }
    // });
    // return like;
    const find = await models.Like.findOne({
      where: { postId, creatorLikesId }
    });
    // const data = (await find)
    //   ? await models.Like.update(
    //       { creatorLikesId, postId, like },
    //       { where: { postId, creatorLikesId } }
    //     )
    //   : await models.Like.create({ creatorLikesId, postId, like });
    // console.log("find:", find);
    // console.log("data:", data);
    // return data;
    if (find) {
      const update = await models.Like.update(
        { like },
        { where: { postId, creatorLikesId } }
      );
      const get = await models.Like.findOne({
        where: { postId, creatorLikesId }
      });
      console.log("get:", get);
      return get;
    } else {
      const create = await models.Like.create({ creatorLikesId, postId, like });
      console.log("create:", create);
      return create;
    }
  },

  createLike: (
    parent,
    { input: { creatorLikesId, postId, like } },
    { models, req }
  ) => {
    isAuth(req);
    return models.Like.create({ creatorLikesId, postId, like });
  },

  updateLike: (parent, { input: { id, like } }, { models, req }) => {
    isAuth(req);
    return models.Like.update({ like }, { where: { id } });
  },

  deleteLike: (parent, { input: { id } }, { models, req }) => {
    isAuth(req);
    return models.Like.destroy({ where: { id } });
  }
};
