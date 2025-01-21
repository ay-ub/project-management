import { Task } from "@/types/tasks";

function hasCycle(tasks: Task[]): boolean {
  // بناء خريطة المهام بالاعتماد على العلاقات
  const taskMap = new Map<number, number[]>();
  tasks.forEach((task) => {
    taskMap.set(task.id, task.dependencies || []);
  });

  const visited = new Set<number>(); // المهام التي تمت زيارتها نهائيًا
  const visiting = new Set<number>(); // المهام التي تتم زيارتها حاليًا أثناء البحث

  // خوارزمية DFS للتحقق من الحلقات
  const dfs = (taskId: number): boolean => {
    if (visiting.has(taskId)) {
      return true; // وُجدت حلقة
    }
    if (visited.has(taskId)) {
      return false; // تمت زيارتها مسبقًا
    }

    // أضف المهمة إلى visiting
    visiting.add(taskId);

    // تحقق من المهام التابعة
    const dependencies = taskMap.get(taskId) || [];
    for (const dep of dependencies) {
      if (dfs(dep)) {
        return true;
      }
    }

    // إزالة المهمة من visiting وإضافتها إلى visited
    visiting.delete(taskId);
    visited.add(taskId);
    return false;
  };

  // التحقق من الحلقات لكل مهمة
  for (const task of tasks) {
    if (dfs(task.id)) {
      return true; // وُجدت حلقة
    }
  }

  return false; // لا توجد حلقات
}

export default hasCycle;
