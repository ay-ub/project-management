module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Task", {
    taskName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
