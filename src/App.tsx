import { useState } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { ResourceTracker } from "./components/ResourceTracker";
import { AvailabilityTracker } from "./components/AvailabilityTracker";
import { WorkforcePlanning } from "./components/WorkforcePlanning";
import { mockProjects, Project, Person } from "./data/mockData";

export default function App() {
  const [activeView, setActiveView] = useState('resource-tracker');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [filters, setFilters] = useState({
    country: 'all',
    project: 'all',
    position: 'all',
    department: 'all',
    status: 'all'
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAssignRole = (projectId: string, roleId: string, person: Person) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          const updatedRoles = project.roles.map(role => {
            if (role.id === roleId) {
              return {
                ...role,
                assignedPerson: person,
                status: 'filled' as const
              };
            }
            return role;
          });

          const filledRoles = updatedRoles.filter(role => role.assignedPerson).length;

          return {
            ...project,
            roles: updatedRoles,
            filledRoles
          };
        }
        return project;
      });
    });
  };

  const handleUnassignRole = (projectId: string, roleId: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          const updatedRoles = project.roles.map(role => {
            if (role.id === roleId) {
              return {
                ...role,
                assignedPerson: undefined,
                status: 'unfilled' as const
              };
            }
            return role;
          });

          const filledRoles = updatedRoles.filter(role => role.assignedPerson).length;

          return {
            ...project,
            roles: updatedRoles,
            filledRoles
          };
        }
        return project;
      });
    });
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'resource-tracker':
        return (
          <ResourceTracker 
            projects={projects}
            onAssignRole={handleAssignRole}
            onUnassignRole={handleUnassignRole}
          />
        );
      case 'availability-tracker':
        return <AvailabilityTracker />;
      case 'workforce-planning':
        return <WorkforcePlanning />;
      case 'home':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Welcome to Moonshot</h2>
              <p className="text-muted-foreground">Select a view from the sidebar to get started</p>
            </div>
          </div>
        );
      case 'clarity':
      case 'radar':
      case 'pcs':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">{activeView.charAt(0).toUpperCase() + activeView.slice(1).replace('-', ' ')}</h2>
              <p className="text-muted-foreground">This feature is coming soon</p>
            </div>
          </div>
        );
      default:
        return <ResourceTracker projects={projects} onAssignRole={handleAssignRole} onUnassignRole={handleUnassignRole} />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex bg-background overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <TopBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="p-3 sm:pl-6 md:pl-6 md:pr-20 lg:pl-6 lg:pr-20  xl:pl-6 xl:pr-20">
              {renderMainContent()}
            </div>
          </main>
        </div>
      </div>
    </DndProvider>
  );
}