export default (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    post: DataTypes.TEXT
  });

  Post.associate = models => {
    Post.hasMany(models.Comment, {
      foreignKey: "postId"
    }),
      Post.hasMany(models.Like, {
        foreignKey: "postId"
      });
  };

  return Post;
};
