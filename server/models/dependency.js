module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Dependency", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Task",
        key: "id",
      },
    },
    dep_taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Task",
        key: "id",
      },
    },
  });
};
