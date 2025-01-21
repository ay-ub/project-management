import * as React from "react";
import { NavProjects } from "./NavProjects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./NavUser";
import { Link } from "react-router-dom";
import { FolderKanban } from "lucide-react";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <Link
          to="/dashboard"
          className="text-center  flex items-center justify-center gap-2"
        >
          <FolderKanban />
          Project Management
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
