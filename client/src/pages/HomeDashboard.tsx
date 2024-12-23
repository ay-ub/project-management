import PopUp from "@/components/PopUp";
import ProjectForm from "@/components/ProjectForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useProject from "@/store/projectStore";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

function HomeDashboard() {
  const { projects, loading } = useProject();
  return projects.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <Link to={`/dashboard/${project.id}`} key={project.id}>
          <Card className="hover:scale-105 duration-300  h-full">
            <CardHeader>
              <CardTitle className="flex justify-between ">
                <span>{project.projectName}</span>{" "}
                <span className="text-primary">
                  {project.createdAt.split("T")[0]}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{project.projectDescription}</CardDescription>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  ) : (
    <div className=" flex justify-center items-center h-[calc(100vh-133px)]">
      {loading ? (
        <Loader className="animate-spin" />
      ) : (
        <div className="flex flex-col gap-2">
          <h1 className="text-muted-foreground">No projects found</h1>
          <PopUp trigger={<Button>create new project</Button>}>
            <ProjectForm />
          </PopUp>
        </div>
      )}
    </div>
  );
}

export default HomeDashboard;
