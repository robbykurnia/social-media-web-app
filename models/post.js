export default (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    post: DataTypes.TEXT
  });

  Post.associate = models => {
    Post.hasMany(models.Comment, {
      foreignKey: "postId"
    });
  };

  return Post;
};
