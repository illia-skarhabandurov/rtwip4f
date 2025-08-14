import { OrganogramCard } from "./OrganogramCard";
import { PeoplePanel } from "./PeoplePanel";
import { Project, Person } from "../data/mockData";
import "../styles/globals.css";

interface ResourceTrackerProps {
  projects: Project[];
  onAssignRole: (projectId: string, roleId: string, person: Person) => void;
  onUnassignRole: (projectId: string, roleId: string) => void;
}

export function ResourceTracker({
  projects,
  onAssignRole,
  onUnassignRole,
}: ResourceTrackerProps) {
  const HEADER_REM = 4; // 4rem = 64px height of the top bar

  return (
    <div className="min-h-[100dvh] overflow-x-hidden">
<div className="min-h-[100dvh] overflow-x-hidden mr-[12rem]">
  <main className="min-w-0">
    <div className="overflow-hidden">
    <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">
      Active Projects
    </h2>

    <div className="space-y-4 sm:space-y-6">
      {projects.map((project) => (
        <OrganogramCard
          key={project.id}
          project={project}
          onAssignRole={(roleId, person) =>
            onAssignRole(project.id, roleId, person)
          }
          onUnassignRole={(roleId) =>
            onUnassignRole(project.id, roleId)
          }
        />
      ))}
    </div>
  </div>
</main>

<div
  className="hidden md:block fixed top-20 right-0 w-[14rem] h-[calc(100vh-4rem)] border-l bg-white z-20"
>
  <div className="hidden md:block fixed top-20 right-0 w-[16rem] h-[calc(100vh-4rem)] border-l bg-white z-20">
    <div className="relative h-full overflow-y-auto no-scrollbar">
      <PeoplePanel />
    </div>
  </div>
</div>
      </div>
    </div>
  );
}
