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
// import detectCycleAndSort from "@/utils/detectCycleAndSort";
function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { projectId } = useParams();

  const getTasks = async () => {
    try {
      const tasks = await fetch(`http://localhost:3000/project/${projectId}`, {
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
  const createTask = async () => {
    // random task Name alphbet
    const taskName = String.fromCharCode(
      Math.floor(Math.random() * 26) + 65
    ).toUpperCase();
    const randomId = Math.floor((Math.random() * 99999) % 999999);
    setTasks([
      ...tasks,
      {
        id:
          tasks.filter((task) => task.id === randomId).length > 0
            ? tasks.length * randomId
            : randomId,
        taskName:
          tasks.filter((task) => task.taskName === taskName).length > 0
            ? `${taskName}${tasks.length}`
            : taskName,
        duration: 1,
        dependencies: [],
      },
    ]);
  };
  useEffect(() => {
    getTasks();
  }, [projectId]);
  const handleSaveTasks = async () => {
    try {
      if (projectId) {
        const res = await fetch(`/api/task`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tasks, projectId }),
        });
        const data = await res.json();
        console.log("data", data);
        if (data.status === "success") {
          Notify("Tasks saved successfully", "success");
          useProject.getState().featchProjectDetails(parseInt(projectId));
        }
      }
    } catch (error) {
      console.log(error);
      Notify("Failed to save tasks", "error");
    }
  };

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
                <TableHead className=" text-nowrap">Task Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="w-full text-center">Depends on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks?.map((task, index) => {
                return <CustTask key={index} task={task} tasks={tasks} />;
              })}
              <TableRow>
                <TableCell className="font-medium text-center">
                  <Button onClick={createTask}>
                    <Plus /> Add Task
                  </Button>
                </TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="flex items-center flex-wrap gap-1"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
        <Button className="w-full" onClick={handleSaveTasks}>
          <Save /> Save
        </Button>
      </SheetContent>
    </Sheet>
  );
}

const CustTask = ({ task, tasks }: { task: Task; tasks: Task[] }) => {
  const allDep = tasks?.map((dep) => {
    return {
      id: dep.id,
      taskName: dep.taskName,
    };
  });
  const [dependencies, setDependencies] = useState<number[]>([]);
  useEffect(() => {
    if (task?.dependencies?.includes(-1)) {
      task.dependencies = [];
    }
    setDependencies(task?.dependencies || []);
  }, []);
  return (
    <TableRow>
      <TableCell className="font-medium text-center">X</TableCell>
      <TableCell className="font-medium text-center">
        <Input
          type="text"
          defaultValue={task?.taskName}
          onChange={(e) => {
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
            className="w-full  h-fit flex justify-start"
          >
            <Button variant="outline">
              <span className="flex items-center gap-1 flex-wrap">
                {task?.dependencies && task?.dependencies.length > 0
                  ? task?.dependencies.map((taskDep, i) => {
                      const dep = allDep?.find((dep) => dep.id === taskDep);
                      return (
                        (dep?.taskName && (
                          <Badge key={i} className="text-xs">
                            {dep?.taskName}
                          </Badge>
                        )) || (
                          <Badge key={i} className="text-xs">
                            {taskDep}
                          </Badge>
                        )
                      );
                    })
                  : "No dependencies"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>select dependencies</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              onClick={() => {
                setDependencies([]);
                task.dependencies = [];
              }}
            >
              <Button variant="destructive" className="w-full">
                Clear
              </Button>
            </DropdownMenuCheckboxItem>
            {allDep?.map((ts, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={dependencies?.includes(ts.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setDependencies([...dependencies, ts.id]);
                    task.dependencies = [...dependencies, ts.id];
                    console.log("task", task);
                  } else {
                    setDependencies([
                      ...dependencies.filter((dep) => dep !== ts.id),
                    ]);
                    task.dependencies = [
                      ...dependencies.filter((dep) => dep !== ts.id),
                    ];
                  }
                }}
              >
                {
                  <span className="flex items-center gap-1">
                    <Badge>{ts.taskName}</Badge>
                  </span>
                }
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default Tasks;
