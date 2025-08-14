import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { OrganogramCard } from "./OrganogramCard";
import { PeoplePanel } from "./PeoplePanel";
import "../styles/globals.css";
export function ResourceTracker({ projects, onAssignRole, onUnassignRole, }) {
    const HEADER_REM = 4; // 4rem = 64px height of the top bar
    return (_jsx("div", { className: "min-h-[100dvh] overflow-x-hidden", children: _jsxs("div", { className: "min-h-[100dvh] overflow-x-hidden mr-[12rem]", children: [_jsx("main", { className: "min-w-0", children: _jsxs("div", { className: "overflow-hidden", children: [_jsx("h2", { className: "mb-3 sm:mb-4 text-lg sm:text-xl font-semibold", children: "Active Projects" }), _jsx("div", { className: "space-y-4 sm:space-y-6", children: projects.map((project) => (_jsx(OrganogramCard, { project: project, onAssignRole: (roleId, person) => onAssignRole(project.id, roleId, person), onUnassignRole: (roleId) => onUnassignRole(project.id, roleId) }, project.id))) })] }) }), _jsx("div", { className: "hidden md:block fixed top-20 right-0 w-[14rem] h-[calc(100vh-4rem)] border-l bg-white z-20", children: _jsx("div", { className: "hidden md:block fixed top-20 right-0 w-[16rem] h-[calc(100vh-4rem)] border-l bg-white z-20", children: _jsx("div", { className: "relative h-full overflow-y-auto no-scrollbar", children: _jsx(PeoplePanel, {}) }) }) })] }) }));
}
