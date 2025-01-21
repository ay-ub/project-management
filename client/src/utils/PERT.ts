import { Task } from "@/types/tasks";
import { levelsType } from "@/types/Pert";
import calculateLevels from "@/utils/calculateLevels";
import calculateStartandEnd from "@/utils/calculateStartEnd";
import calculateLateStartAndEndAndSlack from "@/utils/calculateLateSlack";
import calculateCoordinates from "@/utils/calculateCoordinates";
import getLinks from "@/utils/getLinks";

// const calculateLevels = (tasks: Task[]) => {
//   let currentLevel = 0;
//   const tmpTasks = tasks.map((e) => ({ ...e }));
//   const levels = [] as { id: number; taskName: string; level: number }[];
//   for (let index = 0; index < tmpTasks.length; index++) {
//     tmpTasks.forEach((task) => {
//       if (
//         (!task.dependencies || task.dependencies?.length == 0) &&
//         !levels.find((el) => task.id == el.id)
//       ) {
//         levels.push({
//           id: task.id,
//           taskName: task.taskName,
//           level: currentLevel,
//         });
//       }
//     });
//     tmpTasks.forEach((j) => {
//       j.dependencies = j.dependencies?.filter(
//         (ts) => !levels.find((el) => ts == el.id)
//       );
//     });
//     currentLevel++;
//   }
//   return levels;
// };

// const calculateStartandEnd = (tasks: Task[], levels: levelsType) => {
//   let projectDuration = 0;
//   Object.keys(levels).forEach((level) => {
//     levels[parseInt(level)].forEach((taskId) => {
//       const task = tasks.find((el) => el.id == taskId);
//       if (task) {
//         const dependencies = task.dependencies?.map((id) =>
//           tasks.find((el) => el.id == id)
//         );
//         if (dependencies && dependencies.length > 0) {
//           task.start = Math.max(...dependencies.map((el) => el?.end || 0));
//         } else {
//           task.start = 0;
//         }
//         task.end = task.start + task.duration;
//         if (task.end > projectDuration) {
//           projectDuration = task.end;
//         }
//       }
//     });
//   });

//   return { tasks, projectDuration };
// };

// const calculateLateStartAndEndAndSlack = (
//   tasks: Task[],
//   levels: levelsType,
//   projectDuration: number
// ) => {
//   const levelKeys = Object.keys(levels);
//   levelKeys.reverse().forEach((level) => {
//     levels[parseInt(level)].forEach((taskId) => {
//       const task = tasks.find((el) => el.id == taskId);
//       if (task) {
//         if (levelKeys.length == task.level) {
//           task.lateEnd = projectDuration;
//           task.lateStart = task.lateEnd - task.duration;
//           if (task.lateStart == task.start && task.lateEnd == task.end) {
//             task.critical = true;
//             task.slackFree = 0;
//             task.slackTotal = 0;
//           } else {
//             task.critical = false;
//             if (task.end) {
//               task.slackTotal = task.lateEnd - task.end;
//               task.slackFree = projectDuration - task.end;
//             }
//           }
//         } else if (task.level !== undefined && levelKeys.length > task.level) {
//           // if task is in the last level
//           if (task.level == levelKeys.length - 1) {
//             task.lateEnd = projectDuration;
//             task.lateStart = task.lateEnd - task.duration;
//             // task.critical = true;
//           } else {
//             const currentLevelIndex = task.level;
//             let nextTasks = [] as Task[];
//             for (
//               let nextLevelIndex = currentLevelIndex + 1;
//               nextLevelIndex < levelKeys.length;
//               nextLevelIndex++
//             ) {
//               const nextTasksInLevel = levels[nextLevelIndex]
//                 .map((id) => tasks.find((el) => el.id == id))
//                 .filter((el) => el?.dependencies?.includes(task.id));
//               if (nextTasksInLevel.length > 0) {
//                 nextTasks = [
//                   ...nextTasks,
//                   ...nextTasksInLevel.filter(
//                     (task): task is Task => task !== undefined
//                   ),
//                 ];
//               }
//             }

//             const minLateStart = Math.min(
//               ...nextTasks.map((el) => el?.lateStart || 0)
//             );
//             task.lateEnd = minLateStart;
//             task.lateStart = task.lateEnd - task.duration;
//             if (task.lateStart == task.start && task.lateEnd == task.end) {
//               task.critical = true;
//               task.slackFree = 0;
//               task.slackTotal = 0;
//             } else {
//               task.critical = false;
//               if (task.end) {
//                 const minStrart = Math.min(
//                   ...nextTasks.map((el) => el?.start || 0)
//                 );
//                 task.slackTotal = task.lateEnd - task.end;
//                 task.slackFree = minStrart - task.end;
//               }
//             }
//           }
//         }
//         if (task.level == 0) {
//           task.critical = false;
//         }
//       }
//     });
//   });
// };

// get critical path as array of arrays like [[task1, task2], [task3, task4]] task is an object with id and taskName

// const calculateLateStartAndEndAndSlack = (
//   tasks: Task[],
//   levels: levelsType,
//   projectDuration: number
// ) => {
//   console.log("projectDuration", projectDuration);
//   Object.keys(levels)
//     .reverse()
//     .forEach((level) => {
//       const levelIndex = parseInt(level);
//       levels[levelIndex].forEach((taskId: number) => {
//         const task = tasks.find((el) => el.id == taskId);
//         let nextTasks = [] as Task[];
//         if (task) {
//           if (task?.level == Object.keys(levels).length - 1) {
//             task.lateEnd = projectDuration;
//             task.lateStart = task.lateEnd - task.duration;
//           } else {
//             // get all next tasks ids
//             let nextTasksIds = [] as number[];
//             for (
//               let index = levelIndex + 1;
//               index < Object.keys(levels).length;
//               index++
//             ) {
//               nextTasksIds = [...nextTasksIds, ...levels[index]];
//             }
//             // get all next tasks that depend on current task
//             nextTasks = nextTasksIds
//               .map((id) => tasks.find((el) => el.id == id))
//               .filter(
//                 (el): el is Task => !!el?.dependencies?.includes(task?.id ?? -1)
//               );
//             // test if the task has no next tasks that depend on it
//             if (nextTasks.length == 0) {
//               task.lateEnd = projectDuration;
//               task.lateStart = task.lateEnd - task.duration;
//             } else {
//               // get the minimum late start of the next tasks that depend on the current task
//               const minLateStart = Math.min(
//                 ...nextTasks.map((el) => el?.lateStart || 0)
//               );
//               task.lateEnd = minLateStart;
//               task.lateStart = task.lateEnd - task.duration;
//             }
//           }
//           // calculate slack and critical task based on late start and end values
//           if (task.lateStart == task.start && task.lateEnd == task.end) {
//             task.critical = true;
//             task.slackFree = 0;
//             task.slackTotal = 0;
//           } else {
//             task.critical = false;
//             if (task.end) {
//               task.slackTotal = task.lateEnd - task.end;
//               if (nextTasks.length == 0) {
//                 task.slackFree = projectDuration - task.end;
//               } else {
//                 const minStrart = Math.min(
//                   ...nextTasks.map((el) => el?.start || 0)
//                 );
//                 task.slackFree = minStrart - task.end;
//               }
//             }
//           }
//         }
//       });
//     });
// };
// const getAllCriticalPaths = (tasks: Task[]) => {
//   const findPaths = (currentTask: Task, path: string[]): string[][] => {
//     const newPath = [...path, currentTask.taskName];
//     const nextTasks = tasks.filter(
//       (el) => el.dependencies?.includes(currentTask.id) && el.critical
//     );

//     if (nextTasks.length === 0) {
//       return [newPath];
//     }

//     return nextTasks.flatMap((nextTask) => findPaths(nextTask, newPath));
//   };

//   const startTasks = tasks.filter((el) => el.lateStart == 0);
//   const allPaths = startTasks.flatMap((startTask) => findPaths(startTask, []));

//   return allPaths;
// };

// const getLevels = (initLevels: initLevelType) => {
//   const levels = {} as levelsType;
//   initLevels.forEach((el) => {
//     if (levels[el.level]) {
//       levels[el.level].push(el.id);
//     } else {
//       levels[el.level] = [el.id];
//     }
//   });
//   return levels;
// };

// const getLinks = (tasks: Task[]) => {
//   const links = [] as { from: number; to: number }[];
//   tasks.forEach((task) => {
//     task.dependencies?.forEach((dep) => {
//       links.push({
//         from: task.id,
//         to: dep,
//       });
//     });
//   });

//   return links;
// };

// const calculateCoordinates = (
//   tasks: Task[],
//   nbrOfLevels: number,
//   maxLengthOfLevel: number,
//   levels: levelsType
// ) => {
//   const circleRadius = 50;
//   const marginX = 65;
//   const marginY = 30;
//   const circleHeight = circleRadius * 2;
//   const height =
//     maxLengthOfLevel * circleHeight +
//     (maxLengthOfLevel - 1) * marginY +
//     marginY * 2;

//   const width = nbrOfLevels * circleHeight + (nbrOfLevels + 1) * marginX;

//   Object.keys(levels).forEach((levelKey) => {
//     const level = levels[parseInt(levelKey)];
//     const yTotalHeight = level.length * circleHeight;
//     const yAvailableHeight = height - yTotalHeight;
//     const yGap = yAvailableHeight / (level.length + 1);
//     level.forEach((taskId, index) => {
//       const task = tasks.find((el) => el.id == taskId);
//       if (task) {
//         task.x =
//           marginX * (parseInt(levelKey) + 2) +
//           circleHeight * (parseInt(levelKey) + 1) +
//           marginX;
//         task.y = yGap * (index + 1) + circleHeight * index + marginY;
//       }
//       if (task?.taskName == "Start") {
//         console.log(task);
//       }
//     });
//   });
//   return { width, height };
// };

const pushStartAndEndTask = ({
  tasks,
  levels,
  projectDuration,
}: {
  tasks: Task[];
  levels: levelsType;
  projectDuration: number;
}) => {
  const levelOfEndTask =
    Math.max(...Object.keys(levels).map((el) => parseInt(el))) + 1;
  const levelOfStartTask = -1;
  const startTaskId = -1;
  tasks.push(
    {
      id: startTaskId,
      level: levelOfStartTask,
      taskName: "START",
      duration: 0,
      dependencies: [],
      start: 0,
      end: 0,
      lateStart: 0,
      lateEnd: 0,
      slackFree: 0,
      slackTotal: 0,
      critical: false,
    },
    {
      id: Math.max(...tasks.map((el) => el.id)) + 1,
      taskName: "END",
      duration: 0,
      level: levelOfEndTask,
      dependencies: tasks
        .filter((el) => el.lateEnd == projectDuration)
        .map((el) => el.id),
      start: projectDuration,
      end: projectDuration,
      lateStart: projectDuration,
      lateEnd: projectDuration,
      slackFree: 0,
      slackTotal: 0,
      critical: false,
    }
  );

  levels[levelOfEndTask] = [Math.max(...tasks.map((el) => el.id))];
  // add at first levels[levelOfStartTask] = [-1];
  levels[levelOfStartTask] = [-1];
  if (levels[levelOfStartTask + 1] != undefined) {
    levels[levelOfStartTask + 1].forEach((taskID) => {
      const task = tasks.find((task) => task.id == taskID);
      if (task) {
        task.dependencies?.push(startTaskId);
      }
    });
  }
};
const calculatePert = (initTasks: Task[]) => {
  try {
    const { levels, tasksWithLevel } = calculateLevels(initTasks);
    const { tasks, projectDuration } = calculateStartandEnd(
      tasksWithLevel,
      levels
    );

    calculateLateStartAndEndAndSlack(tasks, levels, projectDuration);

    const maxLengthOfLevel = Math.max(
      ...Object.values(levels).map((el) => el.length)
    );

    pushStartAndEndTask({ tasks, levels, projectDuration });
    const nbrOfLevels = Object.keys(levels).length;

    const { width, height } = calculateCoordinates(
      tasks,
      nbrOfLevels,
      maxLengthOfLevel,
      levels
    );
    const links = getLinks(tasks);
    return {
      tasks: tasks,
      levels,
      projectDuration,
      links,
      width,
      height,
    };
  } catch (error) {
    console.log(error);
  }
};

export default calculatePert;
