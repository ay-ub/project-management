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
import MultiSelect from "./MultiSelect";

function Tasks() {
  // const [alphabet, setAlphabet] = useState<string[]>([
  //   ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  // ]);
  // const [currentAlphabet, setCurrentAlphabet] = useState<number>(0);
  // const [tasks, setTasks] = useState<
  //   { name: string; duration: number; dependencies: string[] }[]
  // >([
  //   {
  //     name: "A",
  //     duration: 1,
  //     dependencies: [],
  //   },
  // ]);

  // const createRow = () => {
  //   setTasks((prev) => [
  //     ...prev,
  //     {
  //       name: alphabet[currentAlphabet],
  //       duration: 1,
  //       dependencies: [],
  //     },
  //   ]);
  //   setCurrentAlphabet((prev) => prev + 1);
  //   tableBodyRef.current?.scrollTo({
  //     top: tableBodyRef.current?.scrollHeight,
  //     behavior: "smooth",
  //   });
  // };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Logs /> Tasks
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[450px]">
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
              <Task
                defaultValue={{ name: "A", duration: 1, dependencies: [] }}
              />
              {/* {tasks?.map((task, index) => {
                return (
                  <Task
                    key={index}
                    defaultValue={{
                      name: task.name,
                      duration: task.duration,
                      dependencies: task.dependencies,
                    }}
                  />
                );
              })} */}
              <TableRow>
                <TableCell className="font-medium text-center">
                  <Button
                  // onClick={createRow}
                  >
                    <Plus /> Add Task
                  </Button>
                </TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="flex items-center flex-wrap gap-1"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
        <Button className="w-full">
          <Save /> Save
        </Button>
      </SheetContent>
    </Sheet>
  );
}

const Task = ({
  defaultValue = { name: "A", duration: 1, dependencies: [] },
}: {
  defaultValue?: { name: string; duration: number; dependencies: string[] };
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium text-center">
        <Input
          type="text"
          defaultValue={defaultValue.name}
          className="text-center w-[70px]"
        />
      </TableCell>
      <TableCell className="text-center">
        <Input
          type="number"
          placeholder="Duration"
          min={1}
          className="w-[60px]"
          defaultValue={defaultValue.duration}
        />
      </TableCell>
      <TableCell className="flex items-center flex-wrap gap-1">
        <MultiSelect />
      </TableCell>
    </TableRow>
  );
};

export default Tasks;
