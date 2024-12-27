import { Task } from "@/types/tasks";
import { initLevelType, levelsType } from "@/types/Pert";

const calculateLevels = (tasks: Task[]) => {
  let currentLevel = 1;
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

const calculateStartandEnd = (
  tasksWithStartAndEnd: Task[],
  levels: levelsType
) => {
  let projectDuration = 0;
  Object.keys(levels).forEach((level) => {
    levels[parseInt(level)].forEach((taskId) => {
      const task = tasksWithStartAndEnd.find((el) => el.id == taskId);
      if (task) {
        const dependencies = task.dependencies?.map((id) =>
          tasksWithStartAndEnd.find((el) => el.id == id)
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

  return { tasksWithStartAndEnd, projectDuration };
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
          const nextLevel = levels[task.level + 1];
          const nextTasks = nextLevel
            .map((id) => tasks.find((el) => el.id == id))
            .filter((el) => el?.dependencies?.includes(task.id));
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

const calculatePert = (tasks: Task[]) => {
  const initLevels = calculateLevels(tasks);
  const levels = getLevels(initLevels);

  const tasksWithLevel = tasks.map((task) => {
    const level = initLevels.find((el) => el.id == task.id);
    return {
      ...task,
      level: level?.level,
    };
  });

  const { tasksWithStartAndEnd, projectDuration } = calculateStartandEnd(
    tasksWithLevel,
    levels
  );
  calculateLateStartAndEndAndSlack(
    tasksWithStartAndEnd,
    levels,
    projectDuration
  );
  return {
    tasks: tasksWithStartAndEnd,
    levels,
    criticalPaths: getAllCriticalPaths(tasksWithStartAndEnd),
    projectDuration,
  };
};

export default calculatePert;
