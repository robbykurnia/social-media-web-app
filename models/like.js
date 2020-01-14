export default (sequelize, DataTypes) => {
  const Like = sequelize.define("Like", {
    like: DataTypes.BOOLEAN
  });

  return Like;
};
