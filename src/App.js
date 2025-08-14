import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { ResourceTracker } from "./components/ResourceTracker";
import { AvailabilityTracker } from "./components/AvailabilityTracker";
import { WorkforcePlanning } from "./components/WorkforcePlanning";
import { mockProjects } from "./data/mockData";
export default function App() {
    const [activeView, setActiveView] = useState('resource-tracker');
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState(mockProjects);
    const [filters, setFilters] = useState({
        country: 'all',
        project: 'all',
        position: 'all',
        department: 'all',
        status: 'all'
    });
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    const handleAssignRole = (projectId, roleId, person) => {
        setProjects(prevProjects => {
            return prevProjects.map(project => {
                if (project.id === projectId) {
                    const updatedRoles = project.roles.map(role => {
                        if (role.id === roleId) {
                            return {
                                ...role,
                                assignedPerson: person,
                                status: 'filled'
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
    const handleUnassignRole = (projectId, roleId) => {
        setProjects(prevProjects => {
            return prevProjects.map(project => {
                if (project.id === projectId) {
                    const updatedRoles = project.roles.map(role => {
                        if (role.id === roleId) {
                            return {
                                ...role,
                                assignedPerson: undefined,
                                status: 'unfilled'
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
                return (_jsx(ResourceTracker, { projects: projects, onAssignRole: handleAssignRole, onUnassignRole: handleUnassignRole }));
            case 'availability-tracker':
                return _jsx(AvailabilityTracker, {});
            case 'workforce-planning':
                return _jsx(WorkforcePlanning, {});
            case 'home':
                return (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Welcome to Moonshot" }), _jsx("p", { className: "text-muted-foreground", children: "Select a view from the sidebar to get started" })] }) }));
            case 'clarity':
            case 'radar':
            case 'pcs':
                return (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: activeView.charAt(0).toUpperCase() + activeView.slice(1).replace('-', ' ') }), _jsx("p", { className: "text-muted-foreground", children: "This feature is coming soon" })] }) }));
            default:
                return _jsx(ResourceTracker, { projects: projects, onAssignRole: handleAssignRole, onUnassignRole: handleUnassignRole });
        }
    };
    return (_jsx(DndProvider, { backend: HTML5Backend, children: _jsxs("div", { className: "h-screen flex bg-background overflow-hidden", children: [_jsx(Sidebar, { activeView: activeView, onViewChange: setActiveView }), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsx(TopBar, { searchQuery: searchQuery, onSearchChange: setSearchQuery, filters: filters, onFilterChange: handleFilterChange }), _jsx("main", { className: "flex-1 overflow-auto", children: _jsx("div", { className: "p-3 sm:pl-6 md:pl-6 md:pr-20 lg:pl-6 lg:pr-20  xl:pl-6 xl:pr-20", children: renderMainContent() }) })] })] }) }));
}
