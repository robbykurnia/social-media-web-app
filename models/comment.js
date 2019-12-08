export default (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    comment: DataTypes.TEXT
  });

  return Comment;
};