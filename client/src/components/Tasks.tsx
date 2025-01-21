import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Logs, Plus, Save } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { Task } from "@/types/tasks";
import { useParams } from "react-router-dom";
import Notify from "@/lib/Notify";
import useProject from "@/store/projectStore";
import hasCycle from "@/utils/detectCycleAndSort";
import Alert from "./Alert";
// import detectCycleAndSort from "@/utils/detectCycleAndSort";
function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { projectId } = useParams();

  const createTask = async () => {
    // get the next alphanumric task name
    const taskName = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randomId = Math.floor((Math.random() * 99999) % 999999);
    setTasks((prev) => [
      ...prev,
      {
        id: randomId,
        taskName: taskName,
        duration: 1,
        dependencies: [],
      },
    ]);
  };
  const getTasks = async () => {
    try {
      const tasks = await fetch(`/api/project/${projectId}`, {
        credentials: "include",
      });
      const data = await tasks.json();
      if (data.status === "success") {
        setTasks(data.data.tasks);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSaveTasks = async () => {
    try {
      if (projectId) {
        if (hasCycle(tasks)) return Notify("Cycle detected ", "error");
        const res = await fetch(`/api/task`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tasks, projectId }),
        });
        const data = await res.json();
        if (data.status === "success") {
          Notify("Tasks saved successfully", "success");
          useProject.getState().featchProjectDetails(parseInt(projectId));
          getTasks();
        }
      }
    } catch (error) {
      console.log(error);
      Notify("Failed to save tasks", "error");
    }
  };
  useEffect(() => {
    if (projectId != undefined) {
      getTasks();
    }
  }, [projectId]);
  useEffect(() => {
    if (tasks) {
      console.log(tasks);
    }
  }, [tasks]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Logs /> Tasks
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Tasks List </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-112px)] rounded-md px-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead className="w-full text-nowrap">Task Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="w-[100px] text-center text-nowrap">
                  Depends on
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks?.map((task) => {
                return (
                  <CustTask
                    handleSaveTasks={handleSaveTasks}
                    key={task.id}
                    task={task}
                    tasks={tasks}
                    setTasks={setTasks}
                  />
                );
              })}
              <TableRow></TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
        <div className=" flex gap-2 items-center">
          <Alert
            title="Save Tasks"
            description="Are you sure you want to save?"
            action="Save"
            cancel="Cancel"
            trigger={
              <Button className="w-full">
                <Save /> Save
              </Button>
            }
            func={handleSaveTasks}
          />
          <Button onClick={createTask} className="w-full">
            <Plus /> Add Task
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const CustTask = ({
  task,
  tasks,
  setTasks,
}: {
  task: Task;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  handleSaveTasks: () => void;
}) => {
  const [dependencies, setDependencies] = useState<number[]>([]);

  const [filteredDependencies, setFilteredDependencies] = useState<
    { id: number; taskName: string }[]
  >([]);

  useEffect(() => {
    setDependencies(task.dependencies || []);
    setFilteredDependencies(
      tasks.filter(
        (item) => item.id != task.id && !item.dependencies?.includes(task.id)
      )
    );
  }, [tasks]);

  const handleDeleteTask = () => {
    tasks.forEach(
      (t) => (t.dependencies = t.dependencies?.filter((dep) => dep !== task.id))
    );
    setTasks(tasks.filter((t) => t.id !== task.id));
  };
  return (
    <TableRow>
      <TableCell className="w-min">
        <Alert
          title="Delete Task"
          description="Are you sure you want to delete this task?"
          action="Delete"
          cancel="Cancel"
          trigger={<Button variant="destructive">Delete Task</Button>}
          func={handleDeleteTask}
        />
      </TableCell>
      <TableCell className="font-medium text-center">
        <Input
          type="text"
          defaultValue={task?.taskName}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              return Notify("Task name can't be empty", "error");
            }
            if (tasks.filter((t) => t.taskName === value).length > 1) {
              return Notify("Task name must be unique", "error");
            }
            task.taskName = e.target.value;
          }}
          className="text-center w-[70px]"
        />
      </TableCell>
      <TableCell className="text-center">
        <Input
          type="number"
          placeholder="Duration"
          min={1}
          className="w-[60px]"
          defaultValue={task?.duration}
          onChange={(e) => {
            task.duration = parseInt(e.target.value);
          }}
        />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="w-full h-fit flex justify-start"
          >
            <Button variant="outline" className="w-full">
              <span className="flex items-center gap-1 flex-wrap w-full">
                {dependencies && dependencies.length > 0
                  ? dependencies
                      .filter((item) => item != -1)
                      .map((taskDep, i) => {
                        const dep = tasks.find((dep) => dep.id === taskDep);
                        if (!dep) {
                          return null;
                        }
                        return (
                          <Badge key={i} className="bg-primary">
                            {dep?.taskName}
                          </Badge>
                        );
                      })
                  : "No dependencies"}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>select dependencies</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filteredDependencies.length === 0 ? (
              <DropdownMenuItem disabled>
                No dependencies available
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => {
                  setDependencies([]);
                  task.dependencies = [];
                }}
              >
                <Button className="w-full">Clear all dependencies</Button>
              </DropdownMenuItem>
            )}
            {filteredDependencies.map((ts, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={dependencies.includes(ts.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    const updatedDeps = [...dependencies, ts.id];
                    setDependencies(updatedDeps);
                    setTasks(
                      tasks.map((t) => {
                        if (t.id === task.id) {
                          t.dependencies = updatedDeps;
                        }
                        return t;
                      })
                    );
                  } else {
                    const updatedDeps = dependencies.filter(
                      (dep) => dep !== ts.id
                    );
                    setDependencies(updatedDeps);
                    setTasks(
                      tasks.map((t) => {
                        if (t.id === task.id) {
                          t.dependencies = updatedDeps;
                        }
                        return t;
                      })
                    );
                  }
                }}
              >
                <span className="flex  w-full text-sm px-4 font-bold">
                  {ts.taskName}
                </span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default Tasks;
