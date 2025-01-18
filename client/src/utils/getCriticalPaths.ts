import { Task } from "@/types/tasks";

const getAllCriticalPaths = (tasks: Task[]) => {
  const findPaths = (currentTask: Task, path: string[]): string[][] => {
    const newPath = [...path, currentTask.taskName];
    const nextTasks = tasks.filter(
      (el) => el.dependencies?.includes(currentTask.id) && el.critical
    );

    if (nextTasks.length === 0) {
      return [newPath];
    }

    return nextTasks.flatMap((nextTask) => findPaths(nextTask, newPath));
  };

  const startTasks = tasks.filter((el) => el.lateStart == 0);
  const allPaths = startTasks.flatMap((startTask) => findPaths(startTask, []));

  return allPaths;
};

export default getAllCriticalPaths;
