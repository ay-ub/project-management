import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import useUser from "@/store/userStore";
import useProject from "@/store/projectStore";
import Notify from "@/lib/Notify";

type projectType = {
  userId: string;
  projectName: string;
  projectDescription: string;
};

type InitProjectType = {
  id: number;
  projectName: string;
  projectDescription: string;
};

function UpdateProject({ initProject }: { initProject: InitProjectType }) {
  const { user } = useUser();
  const [projectData, setProjectData] = useState<projectType>({
    userId: String(user?.email),
    projectName: "",
    projectDescription: "",
  });
  const fetchUpdateProject = useProject((state) => state.fetchUpdateProject);
  const handleCreateProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      initProject.projectName === projectData.projectName &&
      initProject.projectDescription === projectData.projectDescription
    ) {
      return Notify("Project data is the same", "error");
    }
    fetchUpdateProject(projectData, initProject.id);
  };

  useEffect(() => {
    setProjectData({
      userId: String(user?.email),
      projectName: initProject.projectName,
      projectDescription: initProject.projectDescription,
    });
  }, [initProject]);
  return (
    <form onSubmit={handleCreateProject} className="grid gap-4 ">
      <div className="grid gap-2">
        <Label htmlFor="project-name">Project Name:</Label>
        <Input
          id="project-name"
          type="text"
          placeholder="Project of ..."
          required
          value={projectData.projectName}
          onChange={(e) => {
            setProjectData({
              ...projectData,
              projectName: e.target.value,
            });
          }}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="project-desc">Project description:</Label>
        <Textarea
          id="project-desc"
          placeholder="Project description ..."
          required
          value={projectData.projectDescription}
          onChange={(e) => {
            setProjectData({
              ...projectData,
              projectDescription: e.target.value,
            });
          }}
        />
      </div>
      <Button type="submit">Update Project</Button>
    </form>
  );
}

export default UpdateProject;
