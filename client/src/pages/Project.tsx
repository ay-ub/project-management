import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import useProject from "@/store/projectStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Gantt from "@/components/Gantt";
import Pert from "@/components/Pert";
import Slack from "@/components/Slack";

function Project() {
  const { projectId } = useParams();
  const { currentProject, featchProjectDetails, loading } = useProject();
  useEffect(() => {
    if (projectId) {
      featchProjectDetails(parseInt(projectId));
    }
  }, [projectId]);
  return currentProject.projectName ? (
    <Tabs defaultValue="PERT" className="w-full relative">
      <TabsList className="w-full py-2">
        <TabsTrigger value="PERT" className="flex-1 ">
          PERT
        </TabsTrigger>
        <TabsTrigger value="GANTT" className="flex-1 ">
          GANTT
        </TabsTrigger>
        <TabsTrigger value="SLACK" className="flex-1 ">
          SLACK (float)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="PERT">
        <CenterTabContent>
          {loading ? <Loader className="animate-spin" /> : <Pert />}
        </CenterTabContent>
      </TabsContent>
      <TabsContent value="GANTT" className="w-full">
        {loading ? (
          <CenterTabContent>
            <Loader className="animate-spin" />{" "}
          </CenterTabContent>
        ) : (
          <div className="w-full  absolute  h-[calc(100vh-133px)] overflow-y-auto">
            <Gantt />
          </div>
        )}
      </TabsContent>
      <TabsContent value="SLACK">
        {loading ? (
          <CenterTabContent>
            <Loader className="animate-spin" />{" "}
          </CenterTabContent>
        ) : (
          <Slack />
        )}
      </TabsContent>
    </Tabs>
  ) : (
    <div className="w-full h-[calc(100vh-133px)] flex justify-center items-center">
      {loading ? (
        <Loader className="animate-spin" />
      ) : (
        <h1 className="text-2xl text-muted-foreground">No project found</h1>
      )}
    </div>
  );
}

const CenterTabContent = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full flex justify-center items-center h-[calc(100vh-133px)] absolute">
    {children}
  </div>
);

export default Project;
