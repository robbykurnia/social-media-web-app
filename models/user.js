export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, unique: true },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: { isEmail: true }
    },
    password: { type: DataTypes.STRING }
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
