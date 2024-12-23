import { Task } from "@/types/tasks";
import { create } from "zustand";

export type TaskState = {
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (taskId: number) => void;
};
const taskStore = create<TaskState>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  removeTask: (taskId) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) })),
}));

export default taskStore;
