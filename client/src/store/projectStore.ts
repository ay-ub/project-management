import Notify from "@/lib/Notify";
import { PertData } from "@/types/Pert";
import { project } from "@/types/project";
import { Task } from "@/types/tasks";
import calculatePert from "@/utils/PERT";
import { create } from "zustand";
export type ProjectState = {
  projects: project[];
  currentProject: project;
  loading: boolean;
  projectsLoading: boolean;
  pertData: PertData;
  featchProjects: (email: string) => Promise<void>;
  featchProjectDetails: (projectId: number) => Promise<void>;
  fetchDeletProject: (
    projectId: number,
    navigate: (path: string) => void
  ) => Promise<void>;
  fetchCreateProject: (projectData: {
    userId: string;
    projectName: string;
    projectDescription: string;
  }) => Promise<void>;
  fetchUpdateProject: (
    projectData: {
      userId: string;
      projectName: string;
      projectDescription: string;
    },
    projectId: number
  ) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
};
const useProject = create<ProjectState>((set) => ({
  projects: [],
  currentProject: {} as project,
  loading: false,
  projectsLoading: false,
  pertData: {} as PertData,
  featchProjects: async (email) => {
    try {
      set({
        projectsLoading: true,
      });

      const res = await fetch(`/api/project/allProject/${email}`);
      const projects = await res.json();
      if (projects?.status == "success") {
        set({
          projects: projects.data,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({
        projectsLoading: false,
      });
    }
  },
  featchProjectDetails: async (projectId) => {
    try {
      set({
        loading: true,
      });
      const res = await fetch(`/api/project/${projectId}`);

      const currentProjectData = await res.json();
      if (
        currentProjectData?.status == "success" &&
        currentProjectData.data.tasks.length > 0
      ) {
        set({
          currentProject: currentProjectData.data,
        });
        const result = calculatePert(currentProjectData.data.tasks);
        if (!result) return;
        set({
          pertData: result,
        });
      } else if (
        currentProjectData?.status == "success" &&
        currentProjectData.data?.tasks?.length == 0
      ) {
        set({
          currentProject: currentProjectData.data,
          pertData: {} as PertData,
        });
      } else {
        set({
          currentProject: {} as project,
          pertData: {} as PertData,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({
        loading: false,
      });
    }
  },
  fetchDeletProject: async (projectId, navigate) => {
    try {
      const res = await fetch(`/api/project/${projectId}`, {
        method: "delete",
      });
      const resContent = await res.json();
      console.log(resContent);
      if (resContent.status == "success") {
        Notify(resContent.message, "success");
        set((prev) => {
          return {
            projects: prev.projects.filter((item) => item.id != projectId),
          };
        });
        if (
          projectId == useProject.getState().currentProject.id ||
          useProject.getState().projects.length == 0
        ) {
          set({
            currentProject: {} as project,
          });
          navigate("/dashboard");
        }
      } else {
        Notify("project not deleted!", "error");
      }
    } catch (error) {
      console.log(error);
    }
  },
  fetchCreateProject: async (projectData) => {
    if (
      !projectData.userId ||
      !projectData.projectName ||
      !projectData.projectDescription
    ) {
      return Notify("all field is required", "error");
    }
    try {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });
      const resData = await res.json();
      if (resData.status == "success") {
        Notify(resData.message, "success");
        set((state) => ({
          projects: [...state.projects, resData.data],
        }));
      } else {
        Notify(resData.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  },
  fetchUpdateProject: async (projectData, projectId) => {
    if (
      !projectData.userId ||
      !projectData.projectName ||
      !projectData.projectDescription ||
      !projectId
    ) {
      return Notify("all field is required", "error");
    }
    try {
      const res = await fetch(`/api/project/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: projectData.projectName,
          projectDescription: projectData.projectDescription,
          userId: projectData.userId,
        }),
      });
      const resData = await res.json();
      if (resData.status == "success") {
        Notify(resData.message, "success");
        set((state) => ({
          projects: state.projects.map((item) => {
            if (item.id == projectId) {
              return resData.data;
            }
            return item;
          }),
        }));
      } else {
        Notify(resData.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  },
  setTasks: (tasks) => {
    set((state) => ({
      currentProject: {
        ...state.currentProject,
        tasks,
      },
    }));
  },
}));

export default useProject;
