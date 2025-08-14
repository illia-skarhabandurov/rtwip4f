import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { mockWorkforcePlanning, getDepartments, getDepartmentColor } from "../data/mockData";
import { useState } from "react";
export function WorkforcePlanning() {
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const departments = getDepartments();
    const getCellColor = (current, required) => {
        if (current >= required)
            return 'bg-green-100 text-green-800 border-green-200';
        if (current >= required * 0.7)
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };
    // Generate month + week timeline
    const generateTimeline = () => {
        const timeline = [];
        const startDate = new Date('2025-08-11');
        const weeks = mockWorkforcePlanning[0]?.weeklyData || [];
        let currentMonth = '';
        let monthSpan = 0;
        const monthHeaders = [];
        weeks.forEach((week, index) => {
            const weekDate = new Date(week.week);
            const monthName = weekDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            const weekNumber = Math.ceil(weekDate.getDate() / 7);
            if (monthName !== currentMonth) {
                if (currentMonth) {
                    monthHeaders.push({ month: currentMonth, span: monthSpan, startIndex: index - monthSpan });
                }
                currentMonth = monthName;
                monthSpan = 1;
            }
            else {
                monthSpan++;
            }
            timeline.push({
                week: week.week,
                monthName,
                weekNumber,
                weekLabel: `W${weekNumber}`,
                fullDate: weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            });
            // Handle last month
            if (index === weeks.length - 1) {
                monthHeaders.push({ month: currentMonth, span: monthSpan, startIndex: index - monthSpan + 1 });
            }
        });
        return { timeline, monthHeaders };
    };
    const { timeline, monthHeaders } = generateTimeline();
    // Filter data by department
    const filteredData = selectedDepartment === 'all'
        ? mockWorkforcePlanning
        : mockWorkforcePlanning.filter(job => job.department === selectedDepartment);
    // Group by department for better organization
    const groupedData = filteredData.reduce((acc, job) => {
        if (!acc[job.department]) {
            acc[job.department] = [];
        }
        acc[job.department].push(job);
        return acc;
    }, {});
    // Calculate summary stats
    const totalPositions = filteredData.reduce((sum, job) => {
        const latestWeek = job.weeklyData[job.weeklyData.length - 1];
        return sum + latestWeek.required;
    }, 0);
    const totalCurrent = filteredData.reduce((sum, job) => {
        const latestWeek = job.weeklyData[job.weeklyData.length - 1];
        return sum + latestWeek.current;
    }, 0);
    const shortageCount = filteredData.filter(job => {
        const latestWeek = job.weeklyData[job.weeklyData.length - 1];
        return latestWeek.current < latestWeek.required;
    }).length;
    return (_jsxs("div", { className: "h-full flex flex-col", children: [_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold", children: "Workforce Planning Timeline" }), _jsx("p", { className: "text-muted-foreground", children: "Future staffing needs vs. current availability by job title" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Badge, { variant: "outline", className: "text-xs", children: ["Total Required: ", totalPositions] }), _jsxs(Badge, { variant: "outline", className: "text-xs", children: ["Current Available: ", totalCurrent] }), _jsxs(Badge, { variant: shortageCount > 0 ? "destructive" : "default", className: "text-xs", children: ["Roles with Shortage: ", shortageCount] })] })] }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsxs("button", { className: `px-3 py-1 text-xs rounded-md border transition-colors ${selectedDepartment === 'all'
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`, onClick: () => setSelectedDepartment('all'), children: ["All Departments (", mockWorkforcePlanning.length, " roles)"] }), departments.map((deptName) => {
                                const count = mockWorkforcePlanning.filter(job => job.department === deptName).length;
                                if (count === 0)
                                    return null;
                                const deptColors = getDepartmentColor(deptName);
                                return (_jsxs("button", { className: `px-3 py-1 text-xs rounded-md border transition-colors ${selectedDepartment === deptName
                                        ? `${deptColors.bg} ${deptColors.border} ${deptColors.text}`
                                        : `bg-white border-gray-300 hover:bg-gray-50 ${deptColors.text}`}`, onClick: () => setSelectedDepartment(deptName), children: [deptName, " (", count, ")"] }, deptName));
                            })] })] }), _jsxs("div", { className: "flex-1 bg-white rounded-lg border border-border overflow-hidden", children: [_jsxs("div", { className: "sticky top-0 bg-white z-20 border-b border-border", children: [_jsxs("div", { className: "flex", children: [_jsx("div", { className: "w-80 bg-gray-50 border-r border-border" }), _jsx("div", { className: "flex-1", children: _jsx("div", { className: "flex min-w-max", children: monthHeaders.map((month, index) => (_jsx("div", { className: "bg-gray-100 border-r border-border text-center py-2 px-1", style: { width: `${month.span * 80}px` }, children: _jsx("span", { className: "text-sm font-semibold", children: month.month }) }, `${month.month}-${index}`))) }) })] }), _jsxs("div", { className: "flex", children: [_jsx("div", { className: "w-80 p-3 bg-gray-50 border-r border-border", children: _jsx("span", { className: "font-medium", children: "Job Title & Department" }) }), _jsx(ScrollArea, { className: "flex-1", children: _jsx("div", { className: "flex min-w-max", children: timeline.map((timeSlot) => (_jsxs("div", { className: "w-20 p-2 border-r border-border text-center bg-gray-50", children: [_jsx("div", { className: "text-xs font-medium", children: timeSlot.weekLabel }), _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: timeSlot.fullDate })] }, timeSlot.week))) }) })] })] }), _jsx(ScrollArea, { className: "flex-1", style: { height: 'calc(100vh - 380px)' }, children: _jsx("div", { className: "relative", children: Object.entries(groupedData).map(([deptName, jobs]) => {
                                const deptColors = getDepartmentColor(deptName);
                                return (_jsxs("div", { className: "border-b-2 border-gray-200", children: [_jsxs("div", { className: `flex sticky top-0 z-10 ${deptColors.bg} ${deptColors.border} shadow-sm`, children: [_jsx("div", { className: "w-80 p-3 border-r border-white/20", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded bg-white/30" }), _jsx("span", { className: `font-semibold text-sm ${deptColors.text}`, children: deptName }), _jsxs(Badge, { variant: "secondary", className: `ml-2 text-xs bg-white/20 ${deptColors.text} border-white/30`, children: [jobs.length, " roles"] })] }) }), _jsx("div", { className: "flex-1 border-l border-white/20", children: _jsx("div", { className: "flex min-w-max", children: timeline.map((timeSlot) => (_jsx("div", { className: "w-20 p-2 border-r border-white/20 text-center", children: _jsx("div", { className: `text-xs font-medium opacity-90 ${deptColors.text}`, children: timeSlot.weekLabel }) }, timeSlot.week))) }) })] }), jobs.map((jobData) => (_jsxs("div", { className: "flex border-b border-border hover:bg-gray-50", children: [_jsx("div", { className: "w-80 p-3 border-r border-border", children: _jsxs("div", { className: "space-y-1", children: [_jsx("span", { className: "font-medium text-sm", children: jobData.jobTitle }), _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Latest: ", jobData.weeklyData[jobData.weeklyData.length - 1]?.current || 0, "/", jobData.weeklyData[jobData.weeklyData.length - 1]?.required || 0] })] }) }), _jsx("div", { className: "flex min-w-max", children: jobData.weeklyData.map((weekData) => (_jsx("div", { className: `w-20 p-2 border-r border-border text-center transition-colors ${getCellColor(weekData.current, weekData.required)}`, children: _jsxs("div", { className: "space-y-0.5", children: [_jsx("div", { className: "text-sm font-semibold", children: weekData.current }), _jsxs("div", { className: "text-xs opacity-75", children: ["of ", weekData.required] }), _jsxs("div", { className: "text-xs", children: [weekData.required > 0 ? Math.round((weekData.current / weekData.required) * 100) : 0, "%"] })] }) }, `${jobData.jobTitle}-${weekData.week}`))) })] }, `${deptName}-${jobData.jobTitle}`)))] }, deptName));
                            }) }) })] }), _jsx("div", { className: "mt-4 p-4 bg-gray-50 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Staffing Status" }), _jsxs("div", { className: "flex gap-6 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-green-100 border border-green-200 rounded" }), _jsx("span", { children: "Adequately staffed (\u2265100%)" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-yellow-100 border border-yellow-200 rounded" }), _jsx("span", { children: "Partial shortage (70-99%)" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-red-100 border border-red-200 rounded" }), _jsx("span", { children: "Critical shortage (<70%)" })] })] })] }), _jsxs("div", { className: "text-xs text-muted-foreground text-right", children: [_jsx("div", { children: "Current Available / Required" }), _jsx("div", { children: "Percentage shows fulfillment rate" })] })] }) })] }));
}
