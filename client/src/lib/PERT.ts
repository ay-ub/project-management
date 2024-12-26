import { Task } from "@/types/tasks";
type levelsType = { [key: number]: number[] };
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

const setTaskCritical = (task: Task) => {
  if (task.lateStart == task.start && task.lateEnd == task.end) {
    task.critical = true;
    task.slackTotal = 0;
    task.slackFree = 0;
  } else {
    task.critical = false;
  }
};

const calculateLateStartAndEnd = (
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
        }
        setTaskCritical(task);
      }
    });
  });
};

const calculatePositionOfTasks = (tasks: Task[]) => {
  console.log(`pos of tasks `, tasks);
  // tasks.forEach((task) => {
  //   task.x = 0;
  //   task.y = 0;
  // });
};
const calculatePert = (tasks: Task[]) => {
  const result = calculateLevels(tasks);
  const levels = {} as levelsType;
  result.forEach((el) => {
    if (levels[el.level]) {
      levels[el.level].push(el.id);
    } else {
      levels[el.level] = [el.id];
    }
  });

  const tasksWithLevel = tasks.map((task) => {
    const level = result.find((el) => el.id == task.id);
    return {
      ...task,
      level: level?.level,
    };
  });

  const { tasksWithStartAndEnd, projectDuration } = calculateStartandEnd(
    tasksWithLevel,
    levels
  );
  // console.log(tasksWithStartAndEnd, projectDuration);
  calculateLateStartAndEnd(tasksWithStartAndEnd, levels, projectDuration);
  calculatePositionOfTasks(tasksWithStartAndEnd);
  console.log(tasksWithLevel);
  return {
    tasks: tasksWithStartAndEnd,
    levels,
  };
};

export default calculatePert;
