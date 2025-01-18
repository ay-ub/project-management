import { levelsType } from "@/types/Pert";
import { Task } from "@/types/tasks";

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

export default calculateStartandEnd;
