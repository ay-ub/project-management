import { levelsType } from "@/types/Pert";
import { Task } from "@/types/tasks";

const calculateLateStartAndEndAndSlack = (
  tasks: Task[],
  levels: levelsType,
  projectDuration: number
) => {
  Object.keys(levels)
    .reverse()
    .forEach((level) => {
      const levelIndex = parseInt(level);
      levels[levelIndex].forEach((taskId: number) => {
        const task = tasks.find((el) => el.id == taskId);
        let nextTasks = [] as Task[];
        if (task) {
          if (task?.level == Object.keys(levels).length - 1) {
            task.lateEnd = projectDuration;
            task.lateStart = task.lateEnd - task.duration;
          } else {
            // get all next tasks ids
            let nextTasksIds = [] as number[];
            for (
              let index = levelIndex + 1;
              index < Object.keys(levels).length;
              index++
            ) {
              nextTasksIds = [...nextTasksIds, ...levels[index]];
            }
            // get all next tasks that depend on current task
            nextTasks = nextTasksIds
              .map((id) => tasks.find((el) => el.id == id))
              .filter(
                (el): el is Task => !!el?.dependencies?.includes(task?.id ?? -1)
              );
            // test if the task has no next tasks that depend on it
            if (nextTasks.length == 0) {
              task.lateEnd = projectDuration;
              task.lateStart = task.lateEnd - task.duration;
            } else {
              // get the minimum late start of the next tasks that depend on the current task
              const minLateStart = Math.min(
                ...nextTasks.map((el) => el?.lateStart || 0)
              );
              task.lateEnd = minLateStart;
              task.lateStart = task.lateEnd - task.duration;
            }
          }
          // calculate slack and critical task based on late start and end values
          if (task.lateStart == task.start && task.lateEnd == task.end) {
            task.critical = true;
            task.slackFree = 0;
            task.slackTotal = 0;
          } else {
            task.critical = false;
            if (task.end) {
              task.slackTotal = task.lateEnd - task.end;
              if (nextTasks.length == 0) {
                task.slackFree = projectDuration - task.end;
              } else {
                const minStrart = Math.min(
                  ...nextTasks.map((el) => el?.start || 0)
                );
                task.slackFree = minStrart - task.end;
              }
            }
          }
        }
      });
    });
};
export default calculateLateStartAndEndAndSlack;
