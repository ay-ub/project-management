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

function Slack() {
  return (
    <>
      <Table className="mt-4">
        <TableCaption>Slack (float) time for each task.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Task</TableHead>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableHead key={index}>
                {String.fromCharCode(65 + index)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Total Slack (float)</TableCell>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableCell key={index}>
                {Math.floor((Math.random() * 100) % 20)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Free Slack (float)</TableCell>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableCell key={index}>
                {Math.floor((Math.random() * 100) % 20)}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
      <h1>Critical Path:</h1>
      <div className="flex flex-col gap-2 mt-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="flex gap-2" key={index}>
            <Badge>{index + 1}</Badge>
            <Badge variant={"outline"} className="m-1 w-fit">
              A - B - D - F - G - I
            </Badge>
          </div>
        ))}
      </div>
    </>
  );
}

export default Slack;
