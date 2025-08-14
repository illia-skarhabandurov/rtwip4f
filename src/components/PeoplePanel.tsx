import { ChevronRight, Users } from "lucide-react";
import { useState } from "react";
import { PersonCard } from "./PersonCard";
import {
  getPeopleByDepartment,
  getDepartmentsWithCounts,
  getDepartmentColor,
} from "../data/mockData";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export function PeoplePanel() {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["Leadership"])
  );
  const peopleByDepartment = getPeopleByDepartment();
  const departmentsWithCounts = getDepartmentsWithCounts();

  const toggleSection = (sectionKey: string) => {
    const next = new Set(openSections);
    next.has(sectionKey) ? next.delete(sectionKey) : next.add(sectionKey);
    setOpenSections(next);
  };

  const getPersonStatusCounts = (people: any[]) => {
    const available = people.filter((p) => p.status === "available").length;
    const partiallyAvailable = people.filter(
      (p) => p.status === "partially-available"
    ).length;
    const overbooked = people.filter((p) => p.status === "overbooked").length;
    return { available, partiallyAvailable, overbooked };
  };

  const StatusDots = ({
    counts,
  }: {
    counts: { available: number; partiallyAvailable: number; overbooked: number };
  }) => (
    <div className="flex items-center gap-1">
      {counts.available > 0 && (
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs">{counts.available}</span>
        </div>
      )}
      {counts.partiallyAvailable > 0 && (
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <span className="text-xs">{counts.partiallyAvailable}</span>
        </div>
      )}
      {counts.overbooked > 0 && (
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-xs">{counts.overbooked}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* Sticks inside the scroll container of the sidebar */}
      <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b backdrop-blur">
        <h3 className="flex items-center gap-2 font-semibold">
          <Users className="h-4 w-4" />
          People Overview
        </h3>
      </div>


      <div className="space-y-3 p-4">
        {departmentsWithCounts.map((dept) => {
          const jobTitles = peopleByDepartment[dept.name] || {};
          const allPeopleInDept = Object.values(jobTitles).flat() as any[];
          if (allPeopleInDept.length === 0) return null;

          const deptCounts = getPersonStatusCounts(allPeopleInDept);
          const deptColors = getDepartmentColor(dept.name);

          return (
            <Collapsible
              key={`dept-${dept.name}`}
              open={openSections.has(dept.name)}
              onOpenChange={() => toggleSection(dept.name)}
            >
              <CollapsibleTrigger className="w-full">
                <div
                  className={`flex items-center justify-between rounded-lg p-3 transition-opacity hover:opacity-80 ${deptColors.bg} ${deptColors.border} ${deptColors.text}`}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        openSections.has(dept.name) ? "rotate-90" : ""
                      }`}
                    />
                    <span className="text-xs font-medium">{dept.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {allPeopleInDept.length}
                    </span>
                    <StatusDots counts={deptCounts} />
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="ml-4 mt-2 space-y-3">
                {Object.entries(jobTitles).map(([jobTitle, people]) => (
                  <div key={`${dept.name}-${jobTitle}`} className="space-y-2">
                    <div className="px-2 text-sm font-medium text-gray-700">
                      {jobTitle} {(people as any[]).length
                        ? `(${(people as any[]).length})`
                        : ""}
                    </div>
                    <div className="space-y-1">
                      {(people as any[]).map((person) => (
                        <PersonCard
                          key={`person-${person.id}`}
                          person={person}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
