import useProject from "@/store/projectStore";
import { Task } from "@/types/tasks";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
function refactorTasks(tasks: Task[]) {
  return tasks.map((task) => ({
    start: new Date(2020, 0, (task.start ?? 0) + 1),
    end: new Date(2020, 0, (task.end ?? 0) + 1),
    name: task.taskName,
    id: `Task ${task.id}`,
    type: "task",
    progress: 0,
    dependencies: task.dependencies?.map((dep) => `Task ${dep}`),
  }));
}
const GanttContainer = () => {
  // const tasks: Task[] = [
  //   {
  //     start: new Date(2020, 1, 1),
  //     end: new Date(2020, 1, 2),
  //     name: "Idea",
  //     id: "Task 0",
  //     type: "task",
  //     progress: 0,
  //     dependencies: ["Task 1"],
  //   },
  //   {
  //     start: new Date(2020, 1, 2),
  //     end: new Date(2020, 1, 3),
  //     name: "Planning",
  //     id: "Task 1",
  //     type: "task",
  //     progress: 0,
  //   },
  //   {
  //     start: new Date(2020, 1, 3),
  //     end: new Date(2020, 1, 4),
  //     name: "Dev",
  //     id: "Task 2",
  //     type: "task",
  //     progress: 0,
  //     dependencies: ["Task 1", "Task 0"],
  //   },
  //   {
  //     start: new Date(2020, 1, 4),
  //     end: new Date(2020, 1, 5),
  //     name: "Testing",
  //     id: "Task 3",
  //     type: "task",
  //     progress: 0,
  //   },
  //   {
  //     start: new Date(2020, 1, 5),
  //     end: new Date(2020, 1, 6),
  //     name: "Deply",
  //     id: "Task 4",
  //     type: "task",
  //     progress: 0,
  //   },
  //   {
  //     start: new Date(2020, 1, 6),
  //     end: new Date(2020, 1, 7),
  //     name: "Review",
  //     id: "Task 5",
  //     type: "task",
  //     progress: 0,
  //   },
  //   {
  //     start: new Date(2020, 1, 7),
  //     end: new Date(2020, 1, 8),
  //     name: "Launch",
  //     id: "Task 6",
  //     type: "task",
  //     progress: 10,
  //   },
  // ];
  const { pertData } = useProject();
  const tasksWithStartAndEnd = pertData.tasks.filter(
    (task) => task.taskName !== "END" && task.taskName !== "START"
  );
  console.log(tasksWithStartAndEnd);
  const tasks = refactorTasks(tasksWithStartAndEnd);
  return (
    <Gantt
      tasks={tasks}
      listCellWidth=""
      barBackgroundSelectedColor="bb"
      viewMode={ViewMode.Day}
      ganttHeight={490}
      barProgressColor="#00a2c7"
      barBackgroundColor="#00a2c7"
    />
  );
};

export default GanttContainer;
