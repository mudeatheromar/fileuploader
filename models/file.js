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
  
    File.associate = (models) => {
      File.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      File.belongsTo(models.Folder, { foreignKey: "folderId", as: "folder" });
    };
  
    return File;
  };