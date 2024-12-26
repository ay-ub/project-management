const { Project, User, Task, Dependency } = require("../models/index");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const projectData = [
  {
    userId: "johndoe@example.com",
    projectName: "Project Apollo",
    projectDescription:
      "A groundbreaking platform to streamline space research data collection and analysis.",
  },
  {
    userId: "johndoe@example.com",
    projectName: "TechFlow",
    projectDescription:
      "An advanced cloud-based system for real-time monitoring and management of business workflows.",
  },
  {
    userId: "johndoe@example.com",
    projectName: "GreenEarth",
    projectDescription:
      "A sustainable initiative to promote eco-friendly solutions through technology and innovation.",
  },
  {
    userId: "johndoe@example.com",
    projectName: "SmartHealth",
    projectDescription:
      "A cutting-edge application focused on telemedicine, providing remote consultations and patient monitoring.",
  },
  {
    userId: "johndoe@example.com",
    projectName: "FinSecure",
    projectDescription:
      "A secure financial management platform designed to protect user investments and personal data.",
  },
];

const createProject = async (req, res) => {
  try {
    const { userId, projectName, projectDescription } = req.body;

    if (!userId || !projectName || !projectDescription) {
      return res
        .status(400)
        .json({ status: "fail", data: null, message: "all input is require" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", data: null, message: "User not found" });
    }

    // const newProject = await Project.create({
    //   userId,
    //   projectName,
    //   projectDescription,
    // });

    const projects = await Project.bulkCreate(projectData);
    res.status(201).json({
      status: "success",
      message: "Project created successfully",
      // data: newProject,
      data: projects,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: error.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////

const getAllProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.findAll({
      where: {
        userId,
      },
    });

    if (projects.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No projects found",
      });
    }

    res.status(200).json({
      status: "success",
      data: projects,
      message: "Projects fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const projectDetails = await Project.findOne({
      where: {
        id: projectId,
      },
    });
    if (!projectDetails) {
      return res.status(404).json({
        status: "fail",
        data: null,
        message: "Project not found",
      });
    }

    const tasks = await Task.findAll({
      where: { projectId },
      attributes: {
        exclude: ["createdAt", "updatedAt", "description", "projectId"],
      },
    });

    const tasksWithDependencies = await Promise.all(
      tasks.map(async (task) => {
        const dependencies = await Dependency.findAll({
          where: { taskId: task.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        // const detailedDependencies = await Promise.all(
        //   dependencies.map(async (dependency) => {
        //     // const dependentTask = await Task.findOne({
        //     //   where: { id: dependency.dep_taskId },
        //     //   attributes: ["taskName"],
        //     // });

        //     // return {
        //     //   ...dependency.toJSON(),
        //     //   dep_taskName: dependentTask ? dependentTask.taskName : null,
        //     // };
        //     return dependency.dep_taskId;
        //   })
        // );

        return {
          ...task.toJSON(),
          // dependencies: detailedDependencies,
          dependencies: dependencies.map((dependency) => dependency.dep_taskId),
        };
      })
    );

    res.status(200).json({
      status: "success",
      data: { ...projectDetails.dataValues, tasks: tasksWithDependencies },
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(404).json({
        status: "fail",
        message: "projectId is required",
        data: null,
      });
    }

    const existingProject = await Project.findOne({
      where: {
        id: projectId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found",
        data: null,
      });
    }

    const updatedProject = await existingProject.update(req.body);

    res.status(200).json({
      status: "success",
      data: updatedProject,
      message: "Project updated successfully",
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(404).json({
        status: "fail",
        message: "projectId is required",
        data: null,
      });
    }

    const deletedProject = await Project.destroy({
      where: {
        id: projectId,
      },
    });

    if (deletedProject > 0) {
      res.status(200).json({
        status: "success",
        message: "Project has been deleted.",
        data: null,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Project not found",
        data: null,
      });
    }
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectDetails,
  updateProject,
  deleteProject,
};
