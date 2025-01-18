import { PertData } from "@/types/Pert";
import { Task } from "@/types/tasks";
import calculatePert from "@/utils/PERT";
import { create } from "zustand";

export type usePertType = {
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (id: number) => void;
  pertData: PertData;
  Pert: (tasks: Task[]) => void;
};
const usePert = create<usePertType>((set) => ({
  tasks: [],
  pertData: {} as PertData,
  addTask: (task: Task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
  },
  removeTask: (index) => {
    set((state) => ({
      tasks: state.tasks.filter((_, i) => i !== index),
    }));
  },
  Pert: (tasks: Task[]) => {
    set({
      tasks,
    });
    const pertResult = calculatePert(tasks);
    set({
      pertData: {
        tasks: pertResult.tasks,
        levels: pertResult.levels,
        projectDuration: pertResult.projectDuration,
        links: pertResult.links,
        width: pertResult.width,
        height: pertResult.height,
        radius: 50,
      },
    });
  },
}));

export default usePert;
