import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import getAllCriticalPaths from "@/utils/getCriticalPaths";
import usePert from "@/store/pertStore";

function Slack() {
  const pertData = usePert((state) => state.pertData);
  if (!pertData.tasks) {
    return (
      <div>
        <h1>data Not Found...</h1>
      </div>
    );
  }
  const tasksWithoutStartandEnd = pertData.tasks.filter(
    (task) => task.taskName != "START" && task.taskName != "END"
  );
  const criticalPaths = getAllCriticalPaths(tasksWithoutStartandEnd);
  return (
    <>
      <Table className="mt-4">
        <TableCaption>Slack (float) time for each task.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Task (with duration)</TableHead>
            {tasksWithoutStartandEnd.map((task) => (
              <TableHead key={task.id}>
                {`${task.taskName} (${task.duration})`}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Total Slack (float)</TableCell>
            {tasksWithoutStartandEnd.map((task) => (
              <TableCell key={task.id}>{task.slackTotal}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Free Slack (float)</TableCell>
            {tasksWithoutStartandEnd.map((task) => (
              <TableCell key={task.id}>{task.slackFree}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
      <h1>Critical Path:</h1>
      <div className="flex flex-col gap-2 mt-3">
        {criticalPaths.map((path, index) => (
          <div className="flex  gap-1 items-center text-xl" key={index}>
            <div className="">{index + 1}-</div>
            <Badge
              variant={"outline"}
              className="m-1 w-fit text-xl hover:bg-primary-foreground duration-300 ease-in-out cursor-text select-text"
            >
              {path.join(" -> ")}
            </Badge>
          </div>
        ))}
      </div>
    </>
  );
}

export default Slack;
