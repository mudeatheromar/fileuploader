module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define("File", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    folderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return File;
};