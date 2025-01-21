import { Outlet, useParams } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ModeToggle from "@/components/mode-toggle";
import useProject from "@/store/projectStore";
import Tasks from "@/components/Tasks";
export default function DashboardLayout() {
  const projectName = useProject((state) => state.currentProject.projectName);
  const projectDuration = useProject((state) => state.pertData.projectDuration);
  const { projectId } = useParams();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {projectId && projectName ? (
              <div className="flex items-center gap-2">
                <span>{projectName}</span>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <span>{`${projectDuration || 0}days`} </span>
              </div>
            ) : // <span>Projects</span>
            null}
          </div>
          <div className="ml-auto px-3 flex items-center gap-3">
            <ModeToggle />
            <div
              className={`${
                projectId ? "w-fit" : "w-0 overflow-hidden"
              } duration-300`}
            >
              <Tasks />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4  p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
