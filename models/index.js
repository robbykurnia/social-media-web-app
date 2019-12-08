import Sequelize from "sequelize";

const sequelize = new Sequelize("my_graphql_db_2", "my_user", "my_password", {
  dialect: "postgres"
});

// Table
const db = {
  User: sequelize.import("./user"),
  Post: sequelize.import("./post"),
  Comment: sequelize.import("./comment")
};

Object.keys(db).forEach(models => {
  if ("associate" in db[models]) db[models].associate(db);
});

db.sequelize = sequelize;

export default db;
