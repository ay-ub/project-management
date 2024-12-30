import { Task } from "@/types/tasks";
import { initLevelType, levelsType } from "@/types/Pert";

const calculateLevels = (tasks: Task[]) => {
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

const calculateStartandEnd = (tasks: Task[], levels: levelsType) => {
  let projectDuration = 0;
  Object.keys(levels).forEach((level) => {
    levels[parseInt(level)].forEach((taskId) => {
      const task = tasks.find((el) => el.id == taskId);
      if (task) {
        const dependencies = task.dependencies?.map((id) =>
          tasks.find((el) => el.id == id)
        );
        if (dependencies && dependencies.length > 0) {
          task.start = Math.max(...dependencies.map((el) => el?.end || 0));
        } else {
          task.start = 0;
        }
        task.end = task.start + task.duration;
        if (task.end > projectDuration) {
          projectDuration = task.end;
        }
      }
    });
  });

  return { tasks, projectDuration };
};

const calculateLateStartAndEndAndSlack = (
  tasks: Task[],
  levels: levelsType,
  projectDuration: number
) => {
  const levelKeys = Object.keys(levels);
  levelKeys.reverse().forEach((level) => {
    levels[parseInt(level)].forEach((taskId) => {
      const task = tasks.find((el) => el.id == taskId);
      if (task) {
        if (levelKeys.length == task.level) {
          task.lateEnd = projectDuration;
          task.lateStart = task.lateEnd - task.duration;
          if (task.lateStart == task.start && task.lateEnd == task.end) {
            task.critical = true;
            task.slackFree = 0;
            task.slackTotal = 0;
          } else {
            task.critical = false;
            if (task.end) {
              task.slackTotal = task.lateEnd - task.end;
              task.slackFree = projectDuration - task.end;
            }
          }
        } else if (task.level !== undefined && levelKeys.length > task.level) {
          // if task is in the last level
          if (task.level == levelKeys.length - 1) {
            task.lateEnd = projectDuration;
            task.lateStart = task.lateEnd - task.duration;
            // task.critical = true;
          } else {
            const currentLevelIndex = task.level;
            let nextTasks = [] as Task[];
            for (
              let nextLevelIndex = currentLevelIndex + 1;
              nextLevelIndex < levelKeys.length;
              nextLevelIndex++
            ) {
              console.log("nextLevelIndex", nextLevelIndex);
              const nextTasksInLevel = levels[nextLevelIndex]
                .map((id) => tasks.find((el) => el.id == id))
                .filter((el) => el?.dependencies?.includes(task.id));
              if (nextTasksInLevel.length > 0) {
                nextTasks = [
                  ...nextTasks,
                  ...nextTasksInLevel.filter(
                    (task): task is Task => task !== undefined
                  ),
                ];
              }
            }

            const minLateStart = Math.min(
              ...nextTasks.map((el) => el?.lateStart || 0)
            );
            task.lateEnd = minLateStart;
            task.lateStart = task.lateEnd - task.duration;
            if (task.lateStart == task.start && task.lateEnd == task.end) {
              task.critical = true;
              task.slackFree = 0;
              task.slackTotal = 0;
            } else {
              task.critical = false;
              if (task.end) {
                const minStrart = Math.min(
                  ...nextTasks.map((el) => el?.start || 0)
                );
                task.slackTotal = task.lateEnd - task.end;
                task.slackFree = minStrart - task.end;
              }
            }
          }
        }
      }
    });
  });
};

// get critical path as array of arrays like [[task1, task2], [task3, task4]] task is an object with id and taskName
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

const getLinks = (tasks: Task[]) => {
  const links = [] as { from: number; to: number }[];
  tasks.forEach((task) => {
    task.dependencies?.forEach((dep) => {
      links.push({
        from: task.id,
        to: dep,
      });
    });
  });

  return links;
};

const calculateCoordinates = (
  tasks: Task[],
  nbrOfLevels: number,
  maxLengthOfLevel: number,
  levels: levelsType
) => {
  const circleRadius = 50;
  const marginX = 65;
  const marginY = 30;
  const circleHeight = circleRadius * 2;
  const height =
    maxLengthOfLevel * circleHeight +
    (maxLengthOfLevel - 1) * marginY +
    marginY * 2;
  const width =
    nbrOfLevels * circleHeight + (nbrOfLevels - 1) * marginX + marginX * 2;

  Object.keys(levels).forEach((levelKey) => {
    const level = levels[parseInt(levelKey)];
    const yTotalHeight = level.length * circleHeight;
    const yAvailableHeight = height - yTotalHeight;
    const yGap = yAvailableHeight / (level.length + 1);
    const xTotalWidth = circleHeight * nbrOfLevels;
    const xAvailableWidth = width - xTotalWidth;
    const xGap = xAvailableWidth / (nbrOfLevels + 1);

    level.forEach((taskId, index) => {
      const task = tasks.find((el) => el.id == taskId);
      if (task) {
        task.x =
          xGap * (parseInt(levelKey) + 1) +
          circleHeight * parseInt(levelKey) +
          marginX;
        task.y = yGap * (index + 1) + circleHeight * index + marginY;
        // task.y = yGap + (circleHeight + marginY) * index;
      }
    });
  });
  return { width, height };
};

const calculatePert = (initTasks: Task[]) => {
  const initLevels = calculateLevels(initTasks);
  const levels = getLevels(initLevels);

  const tasksWithLevel = initTasks.map((task) => {
    const level = initLevels.find((el) => el.id == task.id);
    return {
      ...task,
      level: level?.level,
    };
  });

  const { tasks, projectDuration } = calculateStartandEnd(
    tasksWithLevel,
    levels
  );
  calculateLateStartAndEndAndSlack(tasks, levels, projectDuration);
  const links = getLinks(tasks);
  const nbrOfLevels = Object.keys(levels).length;
  const maxLengthOfLevel = Math.max(
    ...Object.values(levels).map((el) => el.length)
  );
  const { width, height } = calculateCoordinates(
    tasks,
    nbrOfLevels,
    maxLengthOfLevel,
    levels
  );

  const criticalPaths = getAllCriticalPaths(tasks);

  return {
    tasks: tasks,
    levels,
    criticalPaths,
    projectDuration,
    links,
    width,
    height,
  };
};

export default calculatePert;
