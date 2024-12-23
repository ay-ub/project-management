import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import useUser from "@/store/userStore";
import useProject from "@/store/projectStore";

type projectType = {
  userId: string;
  projectName: string;
  projectDescription: string;
};
function ProjectForm() {
  const { user } = useUser();
  const [project, setProject] = useState<projectType>({
    userId: String(user?.email),
    projectName: "",
    projectDescription: "",
  });
  const { fetchCreateProject } = useProject();
  const handleCreateProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchCreateProject(project);
  };
  return (
    <form onSubmit={handleCreateProject} className="grid gap-4 ">
      <div className="grid gap-2">
        <Label htmlFor="project-name">Project Name:</Label>
        <Input
          id="project-name"
          type="text"
          placeholder="Project of ..."
          required
          value={project.projectName}
          onChange={(e) => {
            setProject({
              ...project,
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
          value={project.projectDescription}
          onChange={(e) => {
            setProject({
              ...project,
              projectDescription: e.target.value,
            });
          }}
        />
      </div>
      <Button type="submit">Create Now</Button>
    </form>
  );
}

export default ProjectForm;
