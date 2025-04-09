const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: process.env.DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
    },
    logging: false,
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import Models
db.Role = require("./role")(sequelize, DataTypes);
db.User = require("./user")(sequelize, DataTypes);
db.Folder = require("./folder")(sequelize, DataTypes);
db.File = require("./file")(sequelize, DataTypes);

// Define Relationships
db.Role.hasMany(db.User, { foreignKey: "roleId", as: "users" });
db.User.belongsTo(db.Role, { foreignKey: "roleId", as: "role" });

db.User.hasMany(db.Folder, { foreignKey: "userId", as: "folders" });
db.Folder.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.User.hasMany(db.File, { foreignKey: "userId", as: "files" });
db.File.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.Folder.hasMany(db.File, { foreignKey: "folderId", as: "files" });
db.File.belongsTo(db.Folder, { foreignKey: "folderId", as: "folder" });

// Self-referencing Folder <-> Folder relationship
db.Folder.hasMany(db.Folder, {
  foreignKey: "parentFolderId",
  as: "subfolders",
});
db.Folder.belongsTo(db.Folder, {
  foreignKey: "parentFolderId",
  as: "parent",
});

// Sync database
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Database synced"))
  .catch((err) => console.log("❌ Error syncing database:", err));

module.exports = db;