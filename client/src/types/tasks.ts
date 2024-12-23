import { Dependency } from "./dependency";

export type Task = {
  id: number;
  taskName: string;
  description: string;
  duration: number;
  createdAt?: string;
  updatedAt?: string;
  projectId: number;
  dependencies?: Dependency[];
  level?: number;
  start?: number;
  end?: number;
  lateStart?: number;
  lateEnd?: number;
  slackTotal?: number;
  critical?: boolean;
};
