const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const userModel = require("./user");
const projectModel = require("./project");
const taskModel = require("./task");
const dependencyModel = require("./dependency");

const User = userModel(sequelize, DataTypes);
const Project = projectModel(sequelize, DataTypes);
const Task = taskModel(sequelize, DataTypes);
const Dependency = dependencyModel(sequelize, DataTypes);

User.hasMany(Project, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Project.belongsTo(User, {
  foreignKey: "userId",
});

Project.hasMany(Task, {
  foreignKey: {
    name: "projectId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Task.belongsTo(Project, {
  foreignKey: "projectId",
});

Task.belongsToMany(Task, {
  through: Dependency,
  as: "task",
  foreignKey: "taskId",
  otherKey: "dep_taskId",
});
Task.belongsToMany(Task, {
  through: Dependency,
  as: "dep_task",
  foreignKey: "dep_taskId",
  otherKey: "taskId",
});

sequelize.sync({ force: false }).then(() => {
  console.log("Database & tables created!");
});

module.exports = {
  User,
  Project,
  Task,
  Dependency,
};
