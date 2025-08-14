import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { mockPeople, mockTimelineEntries, getDepartmentColor, getDepartments } from "../data/mockData";
import { useState } from "react";
export function AvailabilityTracker() {
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const departments = getDepartments();
    // Generate months for the timeline (more compact view)
    const startDate = new Date('2025-08-04'); // Start on a Monday
    const endDate = new Date('2026-12-31');
    const months = [];
    // Create monthly headers with week subdivisions showing actual Monday dates
    for (let d = new Date(startDate); d < endDate; d.setMonth(d.getMonth() + 1)) {
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        // Find the first Monday of the month or the Monday before if month doesn't start on Monday
        const firstMonday = new Date(monthStart);
        const daysToMonday = (8 - monthStart.getDay()) % 7;
        firstMonday.setDate(monthStart.getDate() + daysToMonday);
        if (firstMonday > monthEnd) {
            firstMonday.setDate(monthStart.getDate() - (monthStart.getDay() === 0 ? 0 : monthStart.getDay() - 1));
        }
        const weeks = [];
        const currentWeek = new Date(firstMonday);
        // Get all Mondays in this month
        while (currentWeek <= monthEnd) {
            if (currentWeek >= monthStart || weeks.length === 0) {
                weeks.push({
                    date: new Date(currentWeek),
                    label: currentWeek.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }) // Show as "8/5" format
                });
            }
            currentWeek.setDate(currentWeek.getDate() + 7);
        }
        months.push({
            label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            fullLabel: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            value: new Date(d).toISOString().slice(0, 7),
            weeks: weeks
        });
    }
    const getProjectColor = (projectName, personDepartment) => {
        // Use department colors for better visual organization
        const deptColors = getDepartmentColor(personDepartment);
        return `${deptColors.bg} ${deptColors.border} ${deptColors.text}`;
    };
    const calculateBarPosition = (startWeek, endWeek) => {
        const start = new Date(startWeek);
        const end = new Date(endWeek);
        const timelineStart = new Date('2025-08-01');
        const timelineEnd = new Date('2026-12-31');
        const totalDuration = timelineEnd.getTime() - timelineStart.getTime();
        const startOffset = start.getTime() - timelineStart.getTime();
        const duration = end.getTime() - start.getTime();
        const leftPercent = (startOffset / totalDuration) * 100;
        const widthPercent = (duration / totalDuration) * 100;
        return { left: `${Math.max(0, leftPercent)}%`, width: `${Math.min(100 - leftPercent, widthPercent)}%` };
    };
    // Today's date line position
    const today = new Date();
    const timelineStart = new Date('2025-08-01');
    const timelineEnd = new Date('2026-12-31');
    const todayOffset = ((today.getTime() - timelineStart.getTime()) / (timelineEnd.getTime() - timelineStart.getTime())) * 100;
    // Filter people by department
    const filteredPeople = selectedDepartment === 'all'
        ? mockPeople
        : mockPeople.filter(person => person.department === selectedDepartment);
    // Get availability status counts
    const statusCounts = {
        available: filteredPeople.filter(p => p.status === 'available').length,
        partiallyAvailable: filteredPeople.filter(p => p.status === 'partially-available').length,
        overbooked: filteredPeople.filter(p => p.status === 'overbooked').length
    };
    return (_jsxs("div", { className: "h-full flex flex-col", children: [_jsxs("div", { className: "mb-3 sm:mb-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 mb-2", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg sm:text-xl font-semibold", children: "Availability Tracker" }), _jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Project assignments and availability timeline" })] }), _jsxs("div", { className: "flex items-center gap-1 sm:gap-2 flex-wrap", children: [_jsxs(Badge, { variant: "outline", className: "text-xs", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full mr-1" }), _jsx("span", { className: "hidden sm:inline", children: "Available:" }), _jsx("span", { className: "sm:hidden", children: "Avail:" }), statusCounts.available] }), _jsxs(Badge, { variant: "outline", className: "text-xs", children: [_jsx("div", { className: "w-2 h-2 bg-yellow-500 rounded-full mr-1" }), _jsx("span", { className: "hidden sm:inline", children: "Partial:" }), _jsx("span", { className: "sm:hidden", children: "Part:" }), statusCounts.partiallyAvailable] }), _jsxs(Badge, { variant: "outline", className: "text-xs", children: [_jsx("div", { className: "w-2 h-2 bg-red-500 rounded-full mr-1" }), _jsx("span", { className: "hidden sm:inline", children: "Overbooked:" }), _jsx("span", { className: "sm:hidden", children: "Over:" }), statusCounts.overbooked] })] })] }), _jsxs("div", { className: "flex items-center gap-1 sm:gap-2 flex-wrap", children: [_jsxs("button", { className: `px-2 sm:px-3 py-1 text-xs rounded-md border transition-colors ${selectedDepartment === 'all'
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`, onClick: () => setSelectedDepartment('all'), children: [_jsxs("span", { className: "hidden sm:inline", children: ["All (", mockPeople.length, ")"] }), _jsx("span", { className: "sm:hidden", children: "All" })] }), departments.map((deptName) => {
                                const count = mockPeople.filter(p => p.department === deptName).length;
                                if (count === 0)
                                    return null;
                                const deptColors = getDepartmentColor(deptName);
                                return (_jsxs("button", { className: `px-2 sm:px-3 py-1 text-xs rounded-md border transition-colors ${selectedDepartment === deptName
                                        ? `${deptColors.bg} ${deptColors.border} ${deptColors.text}`
                                        : `bg-white border-gray-300 hover:bg-gray-50 ${deptColors.text}`}`, onClick: () => setSelectedDepartment(deptName), children: [_jsxs("span", { className: "hidden sm:inline", children: [deptName, " (", count, ")"] }), _jsx("span", { className: "sm:hidden", children: deptName })] }, deptName));
                            })] })] }), _jsxs("div", { className: "flex-1 bg-white rounded-lg border border-border overflow-hidden", children: [_jsxs("div", { className: "flex border-b border-border sticky top-0 bg-white z-20", children: [_jsx("div", { className: "w-40 sm:w-48 md:w-56 p-2 bg-gray-50 border-r border-border", children: _jsxs("span", { className: "font-medium text-xs sm:text-sm", children: ["People (", filteredPeople.length, ")"] }) }), _jsx("div", { className: "flex-1 relative", children: _jsx(ScrollArea, { className: "w-full", children: _jsx("div", { className: "flex min-w-max", children: months.map((month) => (_jsxs("div", { className: "border-r border-border bg-gray-50", children: [_jsx("div", { className: "px-1 sm:px-2 py-1 text-center border-b border-border", children: _jsx("span", { className: "text-xs font-medium", children: month.label }) }), _jsx("div", { className: "flex", children: month.weeks.map((week, weekIndex) => (_jsx("div", { className: "w-16 sm:w-20 px-1 py-1 text-center border-r border-border last:border-r-0", children: _jsx("span", { className: "text-xs text-muted-foreground", children: week.label }) }, weekIndex))) })] }, month.value))) }) }) })] }), _jsx(ScrollArea, { className: "flex-1", style: { height: 'calc(100vh - 280px)' }, children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 opacity-75", style: { left: `calc(160px + ${todayOffset}%)` } }), filteredPeople.map((person, index) => {
                                    const personEntries = mockTimelineEntries.filter(entry => entry.personId === person.id);
                                    const deptColors = getDepartmentColor(person.department);
                                    return (_jsxs("div", { className: `flex border-b border-border hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`, children: [_jsx("div", { className: "w-40 sm:w-48 md:w-56 p-2 border-r border-border", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Avatar, { className: "h-6 w-6 flex-shrink-0", children: [_jsx(AvatarImage, { src: person.avatar, alt: person.name }), _jsx(AvatarFallback, { className: "text-xs", children: person.name.split(' ').map(n => n[0]).join('') })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium text-xs truncate", children: person.name }), _jsx("p", { className: "text-xs text-muted-foreground truncate", children: person.role }), _jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [_jsx("div", { className: `w-1.5 h-1.5 rounded-full ${person.status === 'available' ? 'bg-green-500' :
                                                                                person.status === 'partially-available' ? 'bg-yellow-500' : 'bg-red-500'}` }), _jsx("span", { className: `text-xs px-1.5 py-0.5 rounded ${deptColors.bg} ${deptColors.border} ${deptColors.text}`, children: person.department })] })] })] }) }), _jsx("div", { className: "flex-1 relative h-12", children: _jsx("div", { className: "absolute inset-0", children: personEntries.map((entry, index) => {
                                                        const position = calculateBarPosition(entry.startWeek, entry.endWeek);
                                                        const colorClasses = getProjectColor(entry.projectName, person.department);
                                                        return (_jsx("div", { className: `absolute top-1 h-10 rounded border ${colorClasses} flex items-center text-xs font-medium overflow-hidden`, style: position, title: `${entry.projectName} - ${entry.role}\nDepartment: ${person.department}\nDuration: ${entry.startWeek} to ${entry.endWeek}`, children: _jsxs("div", { className: "px-2 truncate text-xs", children: [_jsx("div", { className: "truncate font-medium", children: entry.projectName }), _jsx("div", { className: "truncate text-xs opacity-75", children: entry.role })] }) }, `${entry.projectId}-${index}`));
                                                    }) }) })] }, person.id));
                                })] }) })] }), _jsx("div", { className: "mt-4 p-3 bg-gray-50 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "font-medium", children: "Department Colors:" }), departments.slice(0, 4).map(deptName => {
                                    const deptColors = getDepartmentColor(deptName);
                                    return (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: `w-3 h-3 rounded border ${deptColors.bg} ${deptColors.border}` }), _jsx("span", { children: deptName })] }, deptName));
                                })] }), _jsx("div", { className: "flex items-center gap-4", children: departments.slice(4).map(deptName => {
                                const deptColors = getDepartmentColor(deptName);
                                return (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: `w-3 h-3 rounded border ${deptColors.bg} ${deptColors.border}` }), _jsx("span", { children: deptName })] }, deptName));
                            }) })] }) })] }));
}
