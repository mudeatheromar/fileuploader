module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Role", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    });
  
    // Ensure only the "User" role exists
    Role.sync().then(async () => {
      await Role.findOrCreate({ where: { name: "User" } });
      console.log('✅ "User" role ensured in the database!');
    });
  
    return Role;
  };