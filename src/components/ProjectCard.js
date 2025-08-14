import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Calendar, User } from "lucide-react";
import { RoleSlot } from "./RoleSlot";
import { PersonCard } from "./PersonCard";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
export function ProjectCard({ project, onAssignRole }) {
    const progressPercentage = (project.filledRoles / project.totalRoles) * 100;
    const getProgressColor = (percentage) => {
        if (percentage >= 80)
            return 'bg-green-500';
        if (percentage >= 50)
            return 'bg-yellow-500';
        return 'bg-red-500';
    };
    // Group roles by department
    const rolesByDepartment = project.roles.reduce((acc, role) => {
        if (!acc[role.department]) {
            acc[role.department] = [];
        }
        acc[role.department].push(role);
        return acc;
    }, {});
    return (_jsxs("div", { className: "bg-white rounded-lg border border-border shadow-sm p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-lg font-semibold", children: project.name }), _jsxs(Badge, { variant: "outline", className: "text-xs", children: [project.filledRoles, " / ", project.totalRoles, " roles filled"] })] }), _jsx("div", { className: "flex items-center gap-6 text-sm text-muted-foreground mb-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsxs("span", { children: [new Date(project.startDate).toLocaleDateString(), " - ", new Date(project.endDate).toLocaleDateString()] })] }) }), _jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex items-center justify-between text-sm mb-1", children: [_jsx("span", { children: "Project Fulfillment" }), _jsxs("span", { children: [Math.round(progressPercentage), "%"] })] }), _jsx(Progress, { value: progressPercentage, className: "h-2" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "text-sm font-medium text-gray-700 mb-2 block", children: "Project Director" }), project.director ? (_jsx(PersonCard, { person: project.director, showRole: false, compact: true })) : (_jsxs("div", { className: "p-3 border-2 border-dashed border-gray-300 rounded-lg text-center", children: [_jsx(User, { className: "h-5 w-5 mx-auto text-gray-400 mb-1" }), _jsx("p", { className: "text-sm text-gray-500", children: "No director assigned" })] }))] })] }), _jsx("div", { className: "space-y-6", children: Object.entries(rolesByDepartment).map(([department, roles]) => (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 mb-3", children: department }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: roles.map((role) => (_jsx(RoleSlot, { role: role, onAssign: onAssignRole }, role.id))) })] }, department))) })] }));
}
