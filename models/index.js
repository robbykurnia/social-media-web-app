import Sequelize from "sequelize";

// const sequelize = new Sequelize("my_graphql_db_2", "postgres", "postgres", {
//   dialect: "postgres"
// });

// Temporary database
const sequelize = new Sequelize(
  "	postgres://qgpselmm:tpkrY-Q-WOCatu9yJwGztz_kVeGKp9L3@rajje.db.elephantsql.com:5432/qgpselmm",
  {}
);

const db = {
  User: sequelize.import("./user"),
  Post: sequelize.import("./post"),
  Comment: sequelize.import("./comment"),
  Like: sequelize.import("./like")
};

Object.keys(db).forEach(models => {
  if ("associate" in db[models]) db[models].associate(db);
});

db.sequelize = sequelize;

export default db;
