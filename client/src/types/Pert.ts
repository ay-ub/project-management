import { Task } from "./tasks";

export type levelsType = { [key: number]: number[] };
export type initLevelType = { id: number; taskName: string; level: number }[];

export type PertData = {
  tasks: Task[];
  levels: levelsType;
  projectDuration: number;
  links: { from: number; to: number }[];
  width: number;
  height: number;
  radius: number;
};
