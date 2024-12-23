import { ArrowUpRight, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import useProject from "@/store/projectStore";
import CustomAvatar from "@/components/CustomAvatar";
import PopUp from "@/components/PopUp";
import ProjectForm from "@/components/ProjectForm";
import useUser from "@/store/userStore";

export function NavProjects() {
  const { projects, projectsLoading, featchProjects, fetchDeletProject } =
    useProject();
  const { user } = useUser();
  useEffect(() => {
    if (user?.email) {
      featchProjects(user?.email);
    }
  }, []);
  const { isMobile } = useSidebar();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-base flex items-center justify-between">
        <span>projects</span>
        <PopUp trigger={<Plus />}>
          <ProjectForm />
        </PopUp>
      </SidebarGroupLabel>
      <SidebarMenu>
        {!projectsLoading && projects.length > 0 ? (
          projects.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={`/dashboard/${item.id}`}
                  title={item.projectName}
                  className="side-bar-link"
                >
                  <CustomAvatar name={item.projectName} />
                  <span className="px-2">{item.projectName}</span>
                </NavLink>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem
                    onClick={() => {
                      fetchDeletProject(item.id);
                    }}
                  >
                    <Trash2 className="text-muted-foreground" />
                    <span>Remove from projects</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      window.open(`/dashboard/${item.id}`, "_blank");
                    }}
                  >
                    <ArrowUpRight className="text-muted-foreground" />
                    <span>Open in New Tab</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))
        ) : (
          <span className="text-center">no project found</span>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
