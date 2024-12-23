import { Task } from "./tasks";

export type project = {
  id: number;
  projectName: string;
  projectDescription: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  duration?: number;
  tasks?: Task[];
};
