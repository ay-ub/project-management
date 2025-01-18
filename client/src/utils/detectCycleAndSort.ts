function detectCycleAndSort(tasks) {
  const graph = new Map();
  const inDegree = new Map();
  const result = [];

  // بناء الرسم البياني
  tasks.forEach((task) => {
    graph.set(task.id, task.dependencies || []);
    inDegree.set(task.id, 0);
  });

  // حساب الدرجة الداخلة لكل عقدة
  for (const [node, dependencies] of graph) {
    dependencies.forEach((dep) => {
      inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
    });
  }

  // جمع العقد التي ليس لها تبعيات
  const queue = [];
  for (const [node, degree] of inDegree) {
    if (degree === 0) queue.push(node);
  }

  // ترتيب توبيولوجي
  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);

    // تحديث الدرجة الداخلة للعقد المرتبطة
    graph.get(current)?.forEach((dep) => {
      inDegree.set(dep, inDegree.get(dep) - 1);
      if (inDegree.get(dep) === 0) queue.push(dep);
    });
  }

  // الكشف عن الحلقات
  if (result.length !== tasks.length) {
    throw new Error("Deadlock detected: There is a circular dependency!");
  }

  return result;
}

export default detectCycleAndSort;
