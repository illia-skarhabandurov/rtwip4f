import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { mockPeople, mockTimelineEntries, getDepartmentColor, getDepartments } from "../data/mockData";
import { useState } from "react";

export function AvailabilityTracker() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
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

  const getProjectColor = (projectName: string, personDepartment: string) => {
    // Use department colors for better visual organization
    const deptColors = getDepartmentColor(personDepartment);
    return `${deptColors.bg} ${deptColors.border} ${deptColors.text}`;
  };

  const calculateBarPosition = (startWeek: string, endWeek: string) => {
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

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 mb-2">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Availability Tracker</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Project assignments and availability timeline</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              <span className="hidden sm:inline">Available:</span>
              <span className="sm:hidden">Avail:</span>
              {statusCounts.available}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
              <span className="hidden sm:inline">Partial:</span>
              <span className="sm:hidden">Part:</span>
              {statusCounts.partiallyAvailable}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
              <span className="hidden sm:inline">Overbooked:</span>
              <span className="sm:hidden">Over:</span>
              {statusCounts.overbooked}
            </Badge>
          </div>
        </div>
        
        {/* Department filter */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <button
            className={`px-2 sm:px-3 py-1 text-xs rounded-md border transition-colors ${
              selectedDepartment === 'all' 
                ? 'bg-gray-900 text-white border-gray-900' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedDepartment('all')}
          >
            <span className="hidden sm:inline">All ({mockPeople.length})</span>
            <span className="sm:hidden">All</span>
          </button>
          {departments.map((deptName) => {
            const count = mockPeople.filter(p => p.department === deptName).length;
            if (count === 0) return null;
            
            const deptColors = getDepartmentColor(deptName);
            
            return (
              <button
                key={deptName}
                className={`px-2 sm:px-3 py-1 text-xs rounded-md border transition-colors ${
                  selectedDepartment === deptName 
                    ? `${deptColors.bg} ${deptColors.border} ${deptColors.text}` 
                    : `bg-white border-gray-300 hover:bg-gray-50 ${deptColors.text}`
                }`}
                onClick={() => setSelectedDepartment(deptName)}
              >
                <span className="hidden sm:inline">{deptName} ({count})</span>
                <span className="sm:hidden">{deptName}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg border border-border overflow-hidden">
        {/* Timeline Header */}
        <div className="flex border-b border-border sticky top-0 bg-white z-20">
          <div className="w-40 sm:w-48 md:w-56 p-2 bg-gray-50 border-r border-border">
            <span className="font-medium text-xs sm:text-sm">People ({filteredPeople.length})</span>
          </div>
          <div className="flex-1 relative">
            <ScrollArea className="w-full">
              <div className="flex min-w-max">
                {months.map((month) => (
                  <div key={month.value} className="border-r border-border bg-gray-50">
                    {/* Month header */}
                    <div className="px-1 sm:px-2 py-1 text-center border-b border-border">
                      <span className="text-xs font-medium">{month.label}</span>
                    </div>
                    {/* Week dates */}
                    <div className="flex">
                      {month.weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="w-16 sm:w-20 px-1 py-1 text-center border-r border-border last:border-r-0">
                          <span className="text-xs text-muted-foreground">{week.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Timeline Content */}
        <ScrollArea className="flex-1" style={{ height: 'calc(100vh - 280px)' }}>
          <div className="relative">
            {/* Today's date line */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 opacity-75"
              style={{ left: `calc(160px + ${todayOffset}%)` }}
            />
            
            {filteredPeople.map((person, index) => {
              const personEntries = mockTimelineEntries.filter(entry => entry.personId === person.id);
              const deptColors = getDepartmentColor(person.department);
              
              return (
                <div key={person.id} className={`flex border-b border-border hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}>
                  {/* Person Info - More compact */}
                  <div className="w-40 sm:w-48 md:w-56 p-2 border-r border-border">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={person.avatar} alt={person.name} />
                        <AvatarFallback className="text-xs">{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs truncate">{person.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{person.role}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            person.status === 'available' ? 'bg-green-500' :
                            person.status === 'partially-available' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className={`text-xs px-1.5 py-0.5 rounded ${deptColors.bg} ${deptColors.border} ${deptColors.text}`}>
                            {person.department}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Bars - More compact */}
                  <div className="flex-1 relative h-12">
                    <div className="absolute inset-0">
                      {personEntries.map((entry, index) => {
                        const position = calculateBarPosition(entry.startWeek, entry.endWeek);
                        const colorClasses = getProjectColor(entry.projectName, person.department);
                        return (
                          <div
                            key={`${entry.projectId}-${index}`}
                            className={`absolute top-1 h-10 rounded border ${colorClasses} flex items-center text-xs font-medium overflow-hidden`}
                            style={position}
                            title={`${entry.projectName} - ${entry.role}\nDepartment: ${person.department}\nDuration: ${entry.startWeek} to ${entry.endWeek}`}
                          >
                            <div className="px-2 truncate text-xs">
                              <div className="truncate font-medium">{entry.projectName}</div>
                              <div className="truncate text-xs opacity-75">{entry.role}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="font-medium">Department Colors:</span>
            {departments.slice(0, 4).map(deptName => {
              const deptColors = getDepartmentColor(deptName);
              return (
                <div key={deptName} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded border ${deptColors.bg} ${deptColors.border}`}></div>
                  <span>{deptName}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            {departments.slice(4).map(deptName => {
              const deptColors = getDepartmentColor(deptName);
              return (
                <div key={deptName} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded border ${deptColors.bg} ${deptColors.border}`}></div>
                  <span>{deptName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}