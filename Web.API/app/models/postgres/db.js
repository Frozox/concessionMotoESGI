const Sequelize = require("sequelize");

const connection = new Sequelize(process.env.POSTGRES_CON_STRING, {
  useNewUrlParser: true,
  protocol: "postgres",
  dialect: "postgres",
});

connection
  .authenticate()
  .then(() => {
    console.log("Connected to Postgres");
  })
  .catch((err) => {
    console.error("Unable to connect to Postgres", err);
    process.exit(1);
  });

module.exports = connection;