module.exports = (sequelize, DataTypes) => {
    const Folder = sequelize.define("Folder", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        userId: DataTypes.INTEGER, // 👈 Required

      },
    });
  
    return Folder;
  };