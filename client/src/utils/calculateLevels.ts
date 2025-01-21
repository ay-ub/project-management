import { initLevelType, levelsType } from "@/types/Pert";
import { Task } from "@/types/tasks";
const getInitialLevels = (tasks: Task[]) => {
  let currentLevel = 0;
  const tmpTasks = tasks.map((e) => ({ ...e }));
  const levels = [] as { id: number; taskName: string; level: number }[];
  for (let index = 0; index < tmpTasks.length; index++) {
    tmpTasks.forEach((task) => {
      if (
        (!task.dependencies || task.dependencies?.length == 0) &&
        !levels.find((el) => task.id == el.id)
      ) {
        levels.push({
          id: task.id,
          taskName: task.taskName,
          level: currentLevel,
        });
      }
    });
    tmpTasks.forEach((j) => {
      j.dependencies = j.dependencies?.filter(
        (ts) => !levels.find((el) => ts == el.id)
      );
    });
    currentLevel++;
  }
  return levels;
};
const getLevels = (initLevels: initLevelType) => {
  const levels = {} as levelsType;
  initLevels.forEach((el) => {
    if (levels[el.level]) {
      levels[el.level].push(el.id);
    } else {
      levels[el.level] = [el.id];
    }
  });
  return levels;
};

const calculateLevels = (tasks: Task[]) => {
  // const tasks = [
  //   { id: 1, duration: 5, taskName: "A", dependencies: [8, 10, 11] },
  //   { id: 2, duration: 4, taskName: "B", dependencies: [10, 11] },
  //   { id: 3, duration: 2, taskName: "C", dependencies: [] },
  //   { id: 4, duration: 3, taskName: "D", dependencies: [5, 8] },
  //   { id: 5, duration: 6, taskName: "E", dependencies: [3] },
  //   { id: 6, duration: 8, taskName: "F", dependencies: [] },
  //   { id: 7, duration: 3, taskName: "G", dependencies: [] },
  //   { id: 8, duration: 5, taskName: "H", dependencies: [3, 6, 7] },
  //   { id: 9, duration: 3, taskName: "I", dependencies: [1, 2, 4] },
  //   { id: 10, duration: 5, taskName: "J", dependencies: [3, 6] },
  //   { id: 11, duration: 2, taskName: "K", dependencies: [6, 7] },
  //   { id: 12, duration: 4, taskName: "L", dependencies: [9] },
  //   { id: 13, duration: 4, taskName: "M", dependencies: [9] },
  // ];
  const initLevels = getInitialLevels(tasks);
  const levels = getLevels(initLevels);
  const tasksWithLevel = tasks.map((task) => {
    const level = initLevels.find((el) => el.id == task.id);
    return {
      ...task,
      level: level?.level,
    };
  });

  return { levels, tasksWithLevel };
};
export default calculateLevels;
