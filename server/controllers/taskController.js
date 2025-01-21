const { Task, Project, Dependency } = require("../models");
// const TasksData = [
//   {
//     taskName: "B",
//     description: "Plan the marketing strategy for the next quarter.",
//     duration: 2,
//     projectId: 1,
//   },
//   {
//     taskName: "C",
//     description: "Develop a prototype for the new product feature.",
//     duration: 3,
//     projectId: 1,
//   },
//   {
//     taskName: "D",
//     description: "Review and finalize the client presentation.",
//     duration: 4,
//     projectId: 1,
//   },
//   {
//     taskName: "E",
//     description: "Conduct a team meeting to discuss progress.",
//     duration: 5,
//     projectId: 1,
//   },
//   {
//     taskName: "F",
//     description: "Prepare a detailed report on customer feedback.",
//     duration: 6,
//     projectId: 1,
//   },
// ];

// const createTask = async (req, res) => {
//   try {
//     const { taskName, duration, projectId } = req.body;
//     if (!taskName || !duration || !projectId) {
//       return res.status(400).json({
//         status: "fail",
//         data: null,
//         message: "projectId is require",
//       });
//     }
//     const existingProject = await Project.findAll({
//       where: { id: projectId },
//     });
//     if (!existingProject) {
//       return res.status(404).json({
//         status: "fail",
//         message: "project not found",
//         data: null,
//       });
//     }

//     // const newTask = await Task.create({
//     //   taskName,
//     //   duration,
//     //   projectId,
//     // });
//     const newTask = await Task.bulkCreate(TasksData);
//     res.status(201).json({
//       status: "success",
//       message: "task created",
//       data: newTask,
//     });
//   } catch (error) {
//     console.log("error", error);
//     res.status(400).json({ status: "error", message: error.message });
//   }
// };
const createTask = async (req, res) => {
  try {
    const { projectId, tasks } = req.body;
    if (!tasks || !projectId) {
      return res.status(400).json({
        status: "fail",
        data: null,
        message: "projectId is require",
      });
    }
    const existingProject = await Project.findAll({
      where: { id: projectId },
    });
    if (!existingProject) {
      return res.status(404).json({
        status: "fail",
        message: "project not found",
        data: null,
      });
    }
    const tasksData = tasks.map((task) => ({ ...task, projectId }));
    const dependencyData = tasks.map((task) => {
      if (task.dependencies) {
        return task.dependencies.map((dep) => ({
          taskId: task.id,
          dep_taskId: dep,
        }));
      }
      return [];
    });

    // remove empty array
    const flatDependencyData = dependencyData.flat();

    await Task.destroy({
      where: {
        projectId,
      },
    });
    const newTasks = await Task.bulkCreate(tasksData);
    const newDependencies = await Dependency.bulkCreate(flatDependencyData);
    res.status(201).json({
      status: "success",
      message: "tasks created",
      data: newTasks,
      newDependencies,
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({
        status: "fail",
        data: null,
        message: "projectId is require",
      });
    }
    const tasks = await Task.findAll({
      where: { projectId },
    });

    const tasksWithDependencies = await Promise.all(
      tasks.map(async (task) => {
        const dependencies = await Dependency.findAll({
          where: { taskId: task.id },
        });

        const detailedDependencies = await Promise.all(
          dependencies.map(async (dependency) => {
            const dependentTask = await Task.findOne({
              where: { id: dependency.dep_taskId },
              attributes: ["taskName"],
            });

            return {
              ...dependency.toJSON(),
              dep_taskName: dependentTask ? dependentTask.taskName : null,
            };
          })
        );

        return {
          ...task.toJSON(),
          dependencies: detailedDependencies,
        };
      })
    );
    res.status(200).json({
      status: "success",
      data: tasksWithDependencies,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

const getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;
    const taskDetails = await Task.findOne({
      where: {
        id: taskId,
      },
    });

    if (!taskDetails) {
      return res.status(404).json({
        status: "fail",
        data: null,
        message: "task not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: taskDetails,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(404).json({
        status: "fail",
        message: "taskId is require",
        data: null,
      });
    }
    const existingTask = await Task.findOne({
      where: {
        id: taskId,
      },
    });
    if (!existingTask) {
      return res.status(404).json({
        status: "fail",
        message: "task not found",
        data: null,
      });
    }

    const updatedTask = await existingTask.update(req.body);
    res.status(200).json({
      status: "success",
      date: updatedTask,
      message: "task updated",
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(404).json({
        status: "fail",
        message: "taskId is require",
        data: null,
      });
    }
    const deletedTask = await Task.destroy({
      where: {
        id: taskId,
      },
    });
    if (deletedTask > 0) {
      res.status(200).json({
        status: "success",
        message: "Task has been deleted.",
        data: null,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Task not found",
        data: null,
      });
    }
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskDetails,
  updateTask,
  deleteTask,
};
