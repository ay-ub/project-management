import { levelsType } from "@/types/Pert";
import { Task } from "@/types/tasks";

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

  const width = nbrOfLevels * circleHeight + (nbrOfLevels + 1) * marginX;

  Object.keys(levels).forEach((levelKey) => {
    const level = levels[parseInt(levelKey)];
    const yTotalHeight = level.length * circleHeight;
    const yAvailableHeight = height - yTotalHeight;
    const yGap = yAvailableHeight / (level.length + 1);
    level.forEach((taskId, index) => {
      const task = tasks.find((el) => el.id == taskId);
      if (task) {
        task.x =
          marginX * (parseInt(levelKey) + 2) +
          circleHeight * (parseInt(levelKey) + 1) +
          marginX;
        task.y = yGap * (index + 1) + circleHeight * index + marginY;
      }
    });
  });
  return { width, height };
};

export default calculateCoordinates;
