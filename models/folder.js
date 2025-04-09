module.exports = (sequelize, DataTypes) => {
  const Folder = sequelize.define("Folder", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parentFolderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Folder;
};
