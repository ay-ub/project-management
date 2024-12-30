import { Task } from "./tasks";

export type levelsType = { [key: number]: number[] };
export type initLevelType = { id: number; taskName: string; level: number }[];

export type PertData = {
  tasks: Task[];
  levels: levelsType;
  criticalPaths: string[][];
  projectDuration: number;
  // nbrOfLevels: number;
  // maxLengthOfLevel: number;
  links: { from: number; to: number }[];
};
