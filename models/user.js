export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
  });

  User.associate = models => {
    User.hasMany(models.Post, {
      foreignKey: "creatorPostId"
    }),
      User.hasMany(models.Comment, {
        foreignKey: "creatorCommentId"
      });
  };

  return User;
};
