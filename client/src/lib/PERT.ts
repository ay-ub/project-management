import { Dependency } from "@/types/dependency";
import { Task } from "@/types/tasks";

const calculateLevel = (tasks: Task[]) => {
  let currentLevel = 1 as number;
  const levels = [] as { id: number; level: number }[];
  const tmpTasks = tasks.map((e: Task) => ({ ...e }));

  for (let index = 0; index < tmpTasks.length; index++) {
    tmpTasks.forEach((task: Task) => {
      if (
        (!task.dependencies || task.dependencies?.length == 0) &&
        !levels.find((el) => task.id == el.id)
      ) {
        levels.push({
          id: task.id,
          level: currentLevel,
        });
      }
    });
    tmpTasks.forEach((j) => {
      j.dependencies = j.dependencies?.filter(
        (ts: Dependency) => !levels.find((el) => ts.dep_taskId == el.id)
      );
    });
    currentLevel++;
  }

  levels.forEach((item) => {
    tasks.find((task) => {
      if (task.id == item.id) {
        task.level = item.level;
      }
    });
  });

  tasks.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
  return levels;
};

const calculatePert = (tasks: Task[]) => {
  return calculateLevel(tasks);
};

export default calculatePert;
