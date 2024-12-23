module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("Project", {
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Project;
};
