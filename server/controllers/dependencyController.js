const { Dependency } = require("../models");
const depData = [
  {
    taskId: 7,
    dep_taskId: 6,
  },
  {
    taskId: 8,
    dep_taskId: 6,
  },
  {
    taskId: 9,
    dep_taskId: 7,
  },
  {
    taskId: 9,
    dep_taskId: 8,
  },
  {
    taskId: 10,
    dep_taskId: 9,
  },
  {
    taskId: 11,
    dep_taskId: 10,
  },
];

const createDependency = async (req, res) => {
  try {
    const { taskId, dependencies } = req.body;
    if (!taskId || !dependencies) {
      return res.status(400).json({
        status: "fail",
        data: null,
        message: "taskId or dep_taskId is Require",
      });
    }

    if (dependencies.includes(taskId)) {
      return res.status(400).json({
        status: "fail",
        data: null,
        message: "A task cannot depend on itself.",
      });
    }

    const tasks = await Dependency.bulkCreate([
      ...dependencies.map((dep_taskId) => ({ taskId, dep_taskId })),
    ]);

    res.status(201).json({
      status: "success",
      // data: task,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const deleteDependency = async (req, res) => {
  try {
    const { dependencyId } = req.params;
    if (!dependencyId) {
      return res.status(400).json({
        status: "fail",
        data: null,
        message: "dependencyId is Require",
      });
    }

    const deletedDep = await Dependency.destroy({
      where: {
        id: dependencyId,
      },
    });
    if (deletedDep === 0) {
      return res.status(404).json({
        status: "fail",
        data: null,
        message: "Dependency not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: null,
      message: "Dependency deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  createDependency,
  deleteDependency,
};
