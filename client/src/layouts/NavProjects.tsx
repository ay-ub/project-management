import { Pencil, Plus, Trash } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import useProject from "@/store/projectStore";
import CustomAvatar from "@/components/CustomAvatar";
import PopUp from "@/components/PopUp";
import ProjectForm from "@/components/ProjectForm";
import useUser from "@/store/userStore";
import Alert from "@/components/Alert";
import UpdateProject from "@/components/UpdateProject";

export function NavProjects() {
  const projects = useProject((state) => state.projects);
  const projectsLoading = useProject((state) => state.projectsLoading);
  const featchProjects = useProject((state) => state.featchProjects);
  const fetchDeletProject = useProject((state) => state.fetchDeletProject);
  const user = useUser((state) => state.user);
  useEffect(() => {
    if (user?.email) {
      console.log(user?.email);
      featchProjects(user?.email);
    }
  }, []);

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
            <SidebarMenuItem
              key={index}
              className="flex items-center justify-between px-2"
            >
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
              <div className="flex gap-1 items-center">
                <Alert
                  trigger={
                    <Trash size={18} className="text-red-500 cursor-pointer" />
                  }
                  title="Delete Project"
                  description={`Are you sure you want to delete ${item.projectName} project?`}
                  func={() => {
                    fetchDeletProject(item.id);
                  }}
                  cancel="Cancel"
                  action="Delete"
                />

                <PopUp
                  trigger={
                    <Pencil
                      size={16}
                      className="text-muted-foreground cursor-pointer"
                    />
                  }
                >
                  <UpdateProject
                    initProject={{
                      id: item.id,
                      projectName: item.projectName,
                      projectDescription: item.projectDescription,
                    }}
                  />
                </PopUp>
              </div>
            </SidebarMenuItem>
          ))
        ) : (
          <span className="text-center">no project found</span>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
