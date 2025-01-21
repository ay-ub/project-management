import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
function Alert({
  trigger = <Button>Delete</Button>,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete your data from our servers.",
  action = "Delete",
  cancel = "Cancel",
  func,
}: {
  trigger: JSX.Element;
  title: string;
  description: string;
  action: string;
  cancel: string;
  func: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={func}>{action}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Alert;
