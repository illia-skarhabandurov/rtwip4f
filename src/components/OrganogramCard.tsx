import { Calendar, Users } from "lucide-react";
import { Project, getDepartments, getDepartmentColor, Person } from "../data/mockData";
import { RoleSlot } from "./RoleSlot";
import { Badge } from "./ui/badge";

/* ---------- Palette (explicit Tailwind classes so JIT won't purge) ---------- */
export const palette = {
  orange: { color: "bg-orange-50 border-orange-300 text-orange-900", headerColor: "bg-orange-100 text-white" },
  blue:   { color: "bg-blue-50 border-blue-300 text-blue-900",       headerColor: "bg-blue-100 text-white" },
  green:  { color: "bg-green-50 border-green-300 text-green-900",     headerColor: "bg-green-100 text-white" },
  purple: { color: "bg-purple-50 border-purple-300 text-purple-900",  headerColor: "bg-purple-100 text-white" },
  yellow: { color: "bg-yellow-50 border-yellow-300 text-yellow-900",  headerColor: "bg-yellow-100 text-white" },
  red:    { color: "bg-red-50 border-red-300 text-red-900",           headerColor: "bg-red-100 text-white" },
  indigo: { color: "bg-indigo-50 border-indigo-300 text-indigo-900",  headerColor: "bg-indigo-100 text-white" },
  pink:   { color: "bg-pink-50 border-pink-300 text-pink-900",        headerColor: "bg-pink-100 text-white" },
  gray:   { color: "bg-gray-50 border-gray-300 text-gray-900",        headerColor: "bg-gray-100 text-white" },
} as const;
export type PaletteHue = keyof typeof palette;

/* ---------- Types ---------- */
interface OrganogramCardProps {
  project: Project;
  onAssignRole?: (roleId: string, person: Person) => void;
  onUnassignRole?: (roleId: string) => void;
}

/* ---------- Component ---------- */
export function OrganogramCard({ project, onAssignRole, onUnassignRole }: OrganogramCardProps) {
  // helpers
  const extractClass = (classes: string | undefined, prefix: string) =>
    (classes ?? "").split(" ").find((c) => c.startsWith(prefix));

  const extractTextClass = (classes: string | undefined) =>
    extractClass(classes, "text-") ?? "text-gray-900";

  const extractBorderClass = (classes: string | undefined) =>
    extractClass(classes, "border-") ?? "border-gray-300";

  const stripTextClasses = (classes: string | undefined) =>
    (classes ?? "")
      .split(" ")
      .filter((c) => c && !c.startsWith("text-"))
      .join(" ")
      .trim();

  const getDepartmentConfig = (name: string) => {
    const deptColors = getDepartmentColor(name);
    return {
      name,
      textColor: deptColors.text,
      borderColor: deptColors.border,
      headerNoText: deptColors.bg,
      color: `${deptColors.bg} ${deptColors.border} ${deptColors.text}`,
      headerColor: `${deptColors.bg} ${deptColors.text}`,
    };
  };

  const getDepartmentStats = (deptRoles: typeof project.roles) => {
    const filled = deptRoles.filter((role) => role.assignedPerson).length;
    const total = deptRoles.length;
    return { filled, total };
  };

  const getStatusBadgeVariant = (status: Project["status"]) => {
    switch (status) {
      case "Complete": return "bg-gray-900 text-white";
      case "In Progress": return "bg-blue-500 text-white";
      case "Planning": return "bg-yellow-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const gridColsFor = (count: number) => {
    if (count <= 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2";
    if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    if (count <= 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8";
  };

  // data prep
  const rolesByDepartment = project.roles.reduce((acc, role) => {
    if (role.isLeadership) return acc;
    (acc[role.department] ||= []).push(role);
    return acc;
  }, {} as Record<string, typeof project.roles>);

  const leadershipRoles = project.roles.filter((role) => role.isLeadership);
  const activeDepartments = getDepartments().filter((deptName) => rolesByDepartment[deptName]?.length > 0);

  // render
  return (
    <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Project Header */}
      <div className="p-2 sm:p-3 border-b border-border space-y-3 sm:space-y-4">
        {/* Top row: Project details (left), Leadership inline (middle), Fulfilment (right) */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
          {/* Left: project title & status */}
          <div className="p-2 sm:p-3 min-w-0 lg:min-w-[300px] lg:shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <h3 className="text-base sm:text-lg font-semibold">{project.name}</h3>
              <Badge className={`text-xs px-2 py-1 ${getStatusBadgeVariant(project.status)}`}>
                {project.status}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Middle: Leadership roles inline */}
          {leadershipRoles.length > 0 && (
            <div className="flex-1 flex justify-center overflow-x-auto">
              <div className="flex gap-2 sm:gap-4 min-w-max">
                {leadershipRoles.map((role) => (
                  <div key={role.id} className="bg-white rounded-lg py-2 sm:py-3 w-[160px] sm:w-[200px]">
                    <div className="text-xs sm:text-sm font-medium text-gray-900 mb-2 truncate" title={role.title}>{role.title}</div>
                    <RoleSlot role={role} onAssign={onAssignRole} onUnassign={onUnassignRole} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right: Resource fulfilment */}
          <div className="shrink-0 flex flex-col items-start lg:items-end gap-2 min-w-0 lg:min-w-[300px] p-2 sm:p-3">
            <Badge variant="outline" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Resource Fulfilment</span>
              <span className="sm:hidden">Resources</span>
            </Badge>
            <div className="text-lg sm:text-xl font-semibold">
              {project.filledRoles}/{project.totalRoles}
            </div>
          </div>
        </div>
      </div>

      {/* Department Columns */}
      {activeDepartments.length > 0 && (
        <div className="p-3 sm:p-3 md:p-3">
          <div className={`grid gap-3 sm:gap-3 ${gridColsFor(activeDepartments.length)}`}>
            {activeDepartments.map((deptName) => {
              const deptRoles = rolesByDepartment[deptName] || [];
              const stats = getDepartmentStats(deptRoles);
              const cfg = getDepartmentConfig(deptName);

              return (
                <div key={deptName} className={`rounded-lg overflow-hidden min-w-0 border bg-white ${cfg.borderColor}`}>
                  {/* Tinted Header ONLY */}
                  <div className={`${cfg.headerNoText} p-2 sm:p-3 text-center`}>
                    <div className={`font-semibold text-xs tracking-wide uppercase ${cfg.textColor}`}>
                      {deptName}
                    </div>
                    <div className={`text-xs font-semibold opacity-90 mt-1 px-2 py-1 rounded bg-white/20 backdrop-blur-sm inline-block ${cfg.textColor}`}>
                      {stats.filled}/{stats.total}
                    </div>
                  </div>

                  {/* White Body */}
                  <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
                    {deptRoles.map((role) => (
                      <div key={role.id} className="space-y-1 sm:space-y-2">
                        <div className="text-xs font-medium text-gray-900 leading-tight">{role.title}</div>
                        <RoleSlot role={role} onAssign={onAssignRole} onUnassign={onUnassignRole} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}