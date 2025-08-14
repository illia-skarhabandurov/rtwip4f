import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronRight, Users } from "lucide-react";
import { useState } from "react";
import { PersonCard } from "./PersonCard";
import { getPeopleByDepartment, getDepartmentsWithCounts, getDepartmentColor, } from "../data/mockData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "./ui/collapsible";
export function PeoplePanel() {
    const [openSections, setOpenSections] = useState(new Set(["Leadership"]));
    const peopleByDepartment = getPeopleByDepartment();
    const departmentsWithCounts = getDepartmentsWithCounts();
    const toggleSection = (sectionKey) => {
        const next = new Set(openSections);
        next.has(sectionKey) ? next.delete(sectionKey) : next.add(sectionKey);
        setOpenSections(next);
    };
    const getPersonStatusCounts = (people) => {
        const available = people.filter((p) => p.status === "available").length;
        const partiallyAvailable = people.filter((p) => p.status === "partially-available").length;
        const overbooked = people.filter((p) => p.status === "overbooked").length;
        return { available, partiallyAvailable, overbooked };
    };
    const StatusDots = ({ counts, }) => (_jsxs("div", { className: "flex items-center gap-1", children: [counts.available > 0 && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "h-2 w-2 rounded-full bg-green-500" }), _jsx("span", { className: "text-xs", children: counts.available })] })), counts.partiallyAvailable > 0 && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "h-2 w-2 rounded-full bg-yellow-500" }), _jsx("span", { className: "text-xs", children: counts.partiallyAvailable })] })), counts.overbooked > 0 && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "h-2 w-2 rounded-full bg-red-500" }), _jsx("span", { className: "text-xs", children: counts.overbooked })] }))] }));
    return (_jsxs("div", { className: "w-full", children: [_jsx("div", { className: "sticky top-0 z-10 bg-white px-4 py-3 border-b backdrop-blur", children: _jsxs("h3", { className: "flex items-center gap-2 font-semibold", children: [_jsx(Users, { className: "h-4 w-4" }), "People Overview"] }) }), _jsx("div", { className: "space-y-3 p-4", children: departmentsWithCounts.map((dept) => {
                    const jobTitles = peopleByDepartment[dept.name] || {};
                    const allPeopleInDept = Object.values(jobTitles).flat();
                    if (allPeopleInDept.length === 0)
                        return null;
                    const deptCounts = getPersonStatusCounts(allPeopleInDept);
                    const deptColors = getDepartmentColor(dept.name);
                    return (_jsxs(Collapsible, { open: openSections.has(dept.name), onOpenChange: () => toggleSection(dept.name), children: [_jsx(CollapsibleTrigger, { className: "w-full", children: _jsxs("div", { className: `flex items-center justify-between rounded-lg p-3 transition-opacity hover:opacity-80 ${deptColors.bg} ${deptColors.border} ${deptColors.text}`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ChevronRight, { className: `h-4 w-4 transition-transform ${openSections.has(dept.name) ? "rotate-90" : ""}` }), _jsx("span", { className: "text-xs font-medium", children: dept.name })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium", children: allPeopleInDept.length }), _jsx(StatusDots, { counts: deptCounts })] })] }) }), _jsx(CollapsibleContent, { className: "ml-4 mt-2 space-y-3", children: Object.entries(jobTitles).map(([jobTitle, people]) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "px-2 text-sm font-medium text-gray-700", children: [jobTitle, " ", people.length
                                                    ? `(${people.length})`
                                                    : ""] }), _jsx("div", { className: "space-y-1", children: people.map((person) => (_jsx(PersonCard, { person: person, compact: true }, `person-${person.id}`))) })] }, `${dept.name}-${jobTitle}`))) })] }, `dept-${dept.name}`));
                }) })] }));
}
