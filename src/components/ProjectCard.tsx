import { Calendar, User } from "lucide-react";
import { Project } from "../data/mockData";
import { RoleSlot } from "./RoleSlot";
import { PersonCard } from "./PersonCard";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface ProjectCardProps {
  project: Project;
  onAssignRole?: (roleId: string) => void;
}

export function ProjectCard({ project, onAssignRole }: ProjectCardProps) {
  const progressPercentage = (project.filledRoles / project.totalRoles) * 100;
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Group roles by department
  const rolesByDepartment = project.roles.reduce((acc, role) => {
    if (!acc[role.department]) {
      acc[role.department] = [];
    }
    acc[role.department].push(role);
    return acc;
  }, {} as Record<string, typeof project.roles>);

  return (
    <div className="bg-white rounded-lg border border-border shadow-sm p-6">
      {/* Project Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <Badge variant="outline" className="text-xs">
            {project.filledRoles} / {project.totalRoles} roles filled
          </Badge>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Project Fulfillment</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
        </div>

        {/* Project Director */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Project Director</label>
          {project.director ? (
            <PersonCard person={project.director} showRole={false} compact={true} />
          ) : (
            <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <User className="h-5 w-5 mx-auto text-gray-400 mb-1" />
              <p className="text-sm text-gray-500">No director assigned</p>
            </div>
          )}
        </div>
      </div>

      {/* Roles by Department */}
      <div className="space-y-6">
        {Object.entries(rolesByDepartment).map(([department, roles]) => (
          <div key={department}>
            <h4 className="text-sm font-medium text-gray-900 mb-3">{department}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {roles.map((role) => (
                <RoleSlot
                  key={role.id}
                  role={role}
                  onAssign={onAssignRole}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}