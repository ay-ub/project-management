import { Task } from "@/types/tasks";

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

export default getLinks;
