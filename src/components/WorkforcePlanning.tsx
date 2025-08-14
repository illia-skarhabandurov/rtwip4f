import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { mockWorkforcePlanning, getDepartments, getDepartmentColor } from "../data/mockData";
import { useState } from "react";

export function WorkforcePlanning() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const departments = getDepartments();
  
  const getCellColor = (current: number, required: number) => {
    if (current >= required) return 'bg-green-100 text-green-800 border-green-200';
    if (current >= required * 0.7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
      } else {
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
  }, {} as Record<string, typeof mockWorkforcePlanning>);

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

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-semibold">Workforce Planning Timeline</h2>
            <p className="text-muted-foreground">Future staffing needs vs. current availability by job title</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              Total Required: {totalPositions}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Current Available: {totalCurrent}
            </Badge>
            <Badge variant={shortageCount > 0 ? "destructive" : "default"} className="text-xs">
              Roles with Shortage: {shortageCount}
            </Badge>
          </div>
        </div>
        
        {/* Department filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
              selectedDepartment === 'all' 
                ? 'bg-gray-900 text-white border-gray-900' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedDepartment('all')}
          >
            All Departments ({mockWorkforcePlanning.length} roles)
          </button>
          {departments.map((deptName) => {
            const count = mockWorkforcePlanning.filter(job => job.department === deptName).length;
            if (count === 0) return null;
            
            const deptColors = getDepartmentColor(deptName);
            
            return (
              <button
                key={deptName}
                className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                  selectedDepartment === deptName 
                    ? `${deptColors.bg} ${deptColors.border} ${deptColors.text}` 
                    : `bg-white border-gray-300 hover:bg-gray-50 ${deptColors.text}`
                }`}
                onClick={() => setSelectedDepartment(deptName)}
              >
                {deptName} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg border border-border overflow-hidden">
        {/* Timeline Header - Month + Week */}
        <div className="sticky top-0 bg-white z-20 border-b border-border">
          {/* Month Headers */}
          <div className="flex">
            <div className="w-80 bg-gray-50 border-r border-border"></div>
            <div className="flex-1">
              <div className="flex min-w-max">
                {monthHeaders.map((month, index) => (
                  <div 
                    key={`${month.month}-${index}`}
                    className="bg-gray-100 border-r border-border text-center py-2 px-1"
                    style={{ width: `${month.span * 80}px` }}
                  >
                    <span className="text-sm font-semibold">{month.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Week Headers */}
          <div className="flex">
            <div className="w-80 p-3 bg-gray-50 border-r border-border">
              <span className="font-medium">Job Title & Department</span>
            </div>
            <ScrollArea className="flex-1">
              <div className="flex min-w-max">
                {timeline.map((timeSlot) => (
                  <div key={timeSlot.week} className="w-20 p-2 border-r border-border text-center bg-gray-50">
                    <div className="text-xs font-medium">{timeSlot.weekLabel}</div>
                    <div className="text-xs text-muted-foreground mt-1">{timeSlot.fullDate}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Content - Grouped by Department */}
        <ScrollArea className="flex-1" style={{ height: 'calc(100vh - 380px)' }}>
          <div className="relative">
            {Object.entries(groupedData).map(([deptName, jobs]) => {
              const deptColors = getDepartmentColor(deptName);
              
              return (
                <div key={deptName} className="border-b-2 border-gray-200">
                  {/* Department Header - Now with vibrant colors */}
                  <div className={`flex sticky top-0 z-10 ${deptColors.bg} ${deptColors.border} shadow-sm`}>
                    <div className="w-80 p-3 border-r border-white/20">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-white/30"></div>
                        <span className={`font-semibold text-sm ${deptColors.text}`}>{deptName}</span>
                        <Badge variant="secondary" className={`ml-2 text-xs bg-white/20 ${deptColors.text} border-white/30`}>
                          {jobs.length} roles
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 border-l border-white/20">
                      <div className="flex min-w-max">
                        {timeline.map((timeSlot) => (
                          <div key={timeSlot.week} className="w-20 p-2 border-r border-white/20 text-center">
                            <div className={`text-xs font-medium opacity-90 ${deptColors.text}`}>{timeSlot.weekLabel}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Job Rows */}
                  {jobs.map((jobData) => (
                    <div key={`${deptName}-${jobData.jobTitle}`} className="flex border-b border-border hover:bg-gray-50">
                      {/* Job Title */}
                      <div className="w-80 p-3 border-r border-border">
                        <div className="space-y-1">
                          <span className="font-medium text-sm">{jobData.jobTitle}</span>
                          <div className="text-xs text-muted-foreground">
                            Latest: {jobData.weeklyData[jobData.weeklyData.length - 1]?.current || 0}/
                            {jobData.weeklyData[jobData.weeklyData.length - 1]?.required || 0}
                          </div>
                        </div>
                      </div>

                      {/* Weekly Data */}
                      <div className="flex min-w-max">
                        {jobData.weeklyData.map((weekData) => (
                          <div 
                            key={`${jobData.jobTitle}-${weekData.week}`}
                            className={`w-20 p-2 border-r border-border text-center transition-colors ${getCellColor(weekData.current, weekData.required)}`}
                          >
                            <div className="space-y-0.5">
                              <div className="text-sm font-semibold">{weekData.current}</div>
                              <div className="text-xs opacity-75">of {weekData.required}</div>
                              <div className="text-xs">
                                {weekData.required > 0 ? Math.round((weekData.current / weekData.required) * 100) : 0}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Enhanced Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium mb-2">Staffing Status</h4>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span>Adequately staffed (≥100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                <span>Partial shortage (70-99%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                <span>Critical shortage (&lt;70%)</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            <div>Current Available / Required</div>
            <div>Percentage shows fulfillment rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}