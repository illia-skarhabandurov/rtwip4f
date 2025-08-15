import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  mockPeople,
  mockTimelineEntries,
  getDepartmentColor,
  getDepartments,
} from "../data/mockData";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

// Types
interface TimelineEntry {
  personId: string;
  projectId: string;
  projectName: string;
  startWeek: string;
  endWeek: string;
  role: string;
}

interface Person {
  id: string;
  name: string;
  avatar: string;
  currentProjects: string[];
  availabilityDate: string;
  role: string;
  jobTitle: string;
  department: string;
  level: string;
  status: "available" | "partially-available" | "overbooked";
}

export function AvailabilityTracker() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [zoomLevel, setZoomLevel] = useState(1); // 0.5 - 2
  const departments = getDepartments();

  // ---------- Horizontal scroller ----------
  const hScrollRef = useRef<HTMLDivElement | null>(null);
  const nudge = (px: number) => hScrollRef.current?.scrollBy({ left: px, behavior: "smooth" });

  // Drag-to-pan + Shift+Wheel for horizontal
  useEffect(() => {
    const el = hScrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDown = true;
      el.classList.add("cursor-grabbing");
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1;
      el.scrollLeft = scrollLeft - walk;
    };
    const onUp = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };
    const onWheel = (e: WheelEvent) => {
      if (e.shiftKey) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: "auto" });
      }
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("wheel", onWheel as any);
    };
  }, []);

  // ---------- Zoom helpers ----------
  const getPersonRowHeight = () => {
    if (zoomLevel <= 0.75) return "h-8";
    if (zoomLevel <= 1) return "h-10";
    if (zoomLevel <= 1.25) return "h-12";
    if (zoomLevel <= 1.5) return "h-14";
    return "h-16";
  };
  const getAvatarSize = () => {
    if (zoomLevel <= 0.75) return "h-5 w-5";
    if (zoomLevel <= 1) return "h-6 w-6";
    if (zoomLevel <= 1.25) return "h-7 w-7";
    if (zoomLevel <= 1.5) return "h-8 w-8";
    return "h-9 w-9";
  };
  const getTextSize = () => {
    if (zoomLevel <= 0.75) return "text-[11px]";
    if (zoomLevel <= 1.25) return "text-xs";
    if (zoomLevel <= 1.5) return "text-sm";
    return "text-base";
  };
  const getBarTextSize = () => {
    if (zoomLevel <= 0.75) return "text-[10px]";
    if (zoomLevel <= 1.25) return "text-xs";
    return "text-sm";
  };
  const getWeekWidth = () => {
    if (zoomLevel <= 0.75) return "w-12";
    if (zoomLevel <= 1) return "w-16";
    if (zoomLevel <= 1.25) return "w-20";
    if (zoomLevel <= 1.5) return "w-24";
    return "w-28";
  };
  const rowHeightClass = getPersonRowHeight();
  const isCompact = zoomLevel <= 0.75;
  const isTight = zoomLevel <= 1;

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  // Keyboard zoom shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      if (!meta) return;
      if (e.key === "=" || e.key === "+") { e.preventDefault(); handleZoomIn(); }
      if (e.key === "-") { e.preventDefault(); handleZoomOut(); }
      if (e.key === "0") { e.preventDefault(); handleResetZoom(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ---------- Timeline range ----------
  const { startDate, endDate } = useMemo(() => {
    if (mockTimelineEntries.length === 0) {
      return { startDate: new Date("2025-08-01"), endDate: new Date("2026-12-31") };
    }
    const dates = mockTimelineEntries.flatMap((e: TimelineEntry) => [
      new Date(e.startWeek),
      new Date(e.endWeek),
    ]);
    const start = new Date(Math.min(...dates.map((d) => d.getTime())));
    const end = new Date(Math.max(...dates.map((d) => d.getTime())));
    start.setMonth(start.getMonth() - 1);
    end.setMonth(end.getMonth() + 1);
    return { startDate: start, endDate: end };
  }, []);

  // ---------- Header date helpers ----------
  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const firstMondayOnOrAfter = (d: Date) => {
    const x = new Date(d);
    const delta = (1 - x.getDay() + 7) % 7; // 0..6 to next Monday
    x.setDate(x.getDate() + delta);
    return x;
  };

  // Red line at 18 Dec 2025
  const focusDate = useMemo(() => new Date(2025, 11, 18), []);
  const focusOffset = useMemo(() => {
    const total = endDate.getTime() - startDate.getTime();
    if (total <= 0) return 0;
    const t = Math.min(endDate.getTime(), Math.max(startDate.getTime(), focusDate.getTime()));
    return ((t - startDate.getTime()) / total) * 100; // 0..100
  }, [startDate, endDate, focusDate]);

  // ---------- Months + Monday ticks ----------
  const months = useMemo(() => {
    type MonthBlock = {
      label: string;
      fullLabel: string;
      value: string;
      weeks: { date: Date; label: string }[];
    };
    const out: MonthBlock[] = [];

    const monthStep = zoomLevel >= 1.5 ? 1 : zoomLevel >= 1 ? 1 : 2;
    let cursor = startOfMonth(startDate);
    const endCursor = startOfMonth(endDate);

    while (cursor <= endCursor) {
      const mStart = startOfMonth(cursor);
      const mEnd = endOfMonth(cursor);

      const weeks: { date: Date; label: string }[] = [];
      const weekStep = zoomLevel >= 1.5 ? 1 : 2;

      let tick = firstMondayOnOrAfter(mStart);
      while (tick <= mEnd) {
        weeks.push({
          date: new Date(tick),
          label: isCompact
            ? String(tick.getDate()) // 1, 8, 15...
            : tick.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), // 5 Aug
        });
        tick.setDate(tick.getDate() + 7 * weekStep);
      }

      out.push({
        label: mStart.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
        fullLabel: mStart.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
        value: `${mStart.getFullYear()}-${String(mStart.getMonth() + 1).padStart(2, "0")}`,
        weeks,
      });

      cursor.setMonth(cursor.getMonth() + monthStep);
    }
    return out;
  }, [startDate, endDate, zoomLevel, isCompact]);

  // ---------- Colors + bar positioning ----------
  const getProjectColor = (_projectName: string, personDepartment: string) => {
    const deptColors = getDepartmentColor(personDepartment);
    return `${deptColors.bg} ${deptColors.border} ${deptColors.text}`;
  };

  const calculateBarPosition = (startWeek: string, endWeek: string) => {
    const start = new Date(startWeek);
    const end = new Date(endWeek);

    const totalDuration = endDate.getTime() - startDate.getTime();
    const startOffset = start.getTime() - startDate.getTime();
    const duration = end.getTime() - start.getTime();

    const leftPercent = (startOffset / totalDuration) * 100;
    const widthPercent = (duration / totalDuration) * 100;

    const left = Math.max(0, leftPercent);
    const width = Math.min(100 - left, widthPercent);

    return { left: `${left}%`, width: `${width}%` };
  };

  // Compact date for bars
  const fmtBarDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: isCompact ? "numeric" : "short",
    });

  // ---------- Data / filter ----------
  const filteredPeople =
    selectedDepartment === "all"
      ? mockPeople
      : mockPeople.filter((p: Person) => p.department === selectedDepartment);

  const statusCounts = {
    available: filteredPeople.filter((p) => p.status === "available").length,
    partiallyAvailable: filteredPeople.filter((p) => p.status === "partially-available").length,
    overbooked: filteredPeople.filter((p) => p.status === "overbooked").length,
  };

  // ---------- Sticky left body + scroll sync ----------
  const LEFT_COL_PX = 150;
  const leftBodyRef = useRef<HTMLDivElement | null>(null);
  const rightBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const left = leftBodyRef.current;
    const right = rightBodyRef.current;
    if (!left || !right) return;

    let lock = false;
    const onRight = () => {
      if (lock) return;
      lock = true;
      left.scrollTop = right.scrollTop;
      lock = false;
    };
    const onLeft = () => {
      if (lock) return;
      lock = true;
      right.scrollTop = left.scrollTop;
      lock = false;
    };

    right.addEventListener("scroll", onRight, { passive: true });
    left.addEventListener("scroll", onLeft, { passive: true });
    return () => {
      right.removeEventListener("scroll", onRight);
      left.removeEventListener("scroll", onLeft);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header: title + badges + filters + zoom */}
      <div className="mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 mb-2">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Availability Tracker</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Project assignments and availability timeline
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
              <span className="hidden sm:inline">Available:</span>
              <span className="sm:hidden">Avail:</span>
              {statusCounts.available}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
              <span className="hidden sm:inline">Partial:</span>
              <span className="sm:hidden">Part:</span>
              {statusCounts.partiallyAvailable}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
              <span className="hidden sm:inline">Overbooked:</span>
              <span className="sm:hidden">Over:</span>
              {statusCounts.overbooked}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Department filter */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <button
              className={`px-2 sm:px-3 py-1 text-xs rounded-md border transition-colors ${
                selectedDepartment === "all"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedDepartment("all")}
            >
              <span className="hidden sm:inline">All ({mockPeople.length})</span>
              <span className="sm:hidden">All</span>
            </button>

            {departments.map((deptName: string) => {
              const count = mockPeople.filter((p: Person) => p.department === deptName).length;
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
                  <span className="hidden sm:inline">
                    {deptName} ({count})
                  </span>
                  <span className="sm:hidden">{deptName}</span>
                </button>
              );
            })}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded border border-gray-300 transition-colors"
                title="Zoom Out - See more people with smaller elements"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-xs text-gray-600 min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded border border-gray-300 transition-colors"
                title="Zoom In - See fewer people with larger elements"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded border border-gray-300 transition-colors"
                title="Reset Zoom - Return to default view"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs text-gray-600 border-l border-gray-300 pl-2">
              {filteredPeople.length} people visible
            </div>
          </div>
        </div>
      </div>

      {/* MAIN: outer H scroller keeps header/body aligned */}
      <div className="flex-1 bg-white rounded-lg border border-border overflow-hidden relative">
        {/* Horizontal scroller */}
        <div
          ref={hScrollRef}
          className="w-full overflow-x-auto overflow-y-hidden cursor-grab select-none"
        >
          <div className="min-w-max">
            {/* HEADER ROW (sticky top) */}
            <div className="flex border-b border-border sticky top-0 bg-white z-20">
              {/* Left fixed header cell (sticky left) */}
              <div
                className="w-[150px] flex-none p-2 bg-gray-50 border-r border-border
                           sticky left-0 z-30"
              >
                <span className="font-medium text-xs sm:text-sm">
                  People ({filteredPeople.length})
                </span>
              </div>

              {/* Right: months/weeks rail + focus line */}
              <div className="relative flex-1">
                <div className="flex min-w-max">
                  {months.map((month) => (
                    <div key={month.value} className="border-r border-border bg-gray-50">
                      <div className="px-1 sm:px-2 py-1 text-center border-b border-border">
                        <span className="text-xs font-medium">{month.label}</span>
                      </div>
                      <div className="flex">
                        {month.weeks.map((week, i) => (
                          <div
                            key={`${month.value}-${i}`}
                            className={`${getWeekWidth()} px-1 py-1 text-center border-r border-border last:border-r-0`}
                          >
                            <span className="text-xs text-muted-foreground">{week.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BODY: sticky left column + synced right rails */}
            <div className="relative flex">
              {/* LEFT sticky wrapper (child of H scroller) */}
              <div className="sticky left-0 z-30 bg-white border-r border-border w-[150px]">
                <div
                  ref={leftBodyRef}
                  className="overflow-hidden"
                  style={{ height: "calc(100vh - 280px)" }}
                >
                  {filteredPeople.map((person: Person, index: number) => (
                    <div
                      key={person.id}
                      className={`flex items-center ${rowHeightClass} border-b border-border px-2 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                      title={`${person.name} — ${person.role}`}
                    >
                      <Avatar className={`${getAvatarSize()} flex-shrink-0`}>
                        <AvatarImage src={person.avatar} alt={person.name} />
                        <AvatarFallback className="text-xs">
                          {person.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 min-w-0 ${isTight ? "ml-1" : "ml-2"}`}>
                        <p className={`font-medium ${getTextSize()} truncate`}>{person.name}</p>
                        {!isCompact && (
                          <p className={`${getTextSize()} text-muted-foreground truncate`}>
                            {person.role}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT rails (independent vertical scroller) */}
              <div className="flex-1">
                <div
                  ref={rightBodyRef}
                  className="overflow-y-auto"
                  style={{ height: "calc(100vh - 280px)" }}
                >
                  <div className="relative">
                    {/* Red line at 18 Dec 2025 */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-600/80 pointer-events-none z-10"
                      style={{ left: `${focusOffset}%` }}
                    />
                    {filteredPeople.map((person: Person, index: number) => {
                      const personEntries = mockTimelineEntries.filter(
                        (entry: TimelineEntry) => entry.personId === person.id
                      );
                      return (
                        <div
                          key={person.id}
                          className={`${rowHeightClass} relative border-b border-border ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <div className="absolute inset-0">
                            {personEntries.map((entry: TimelineEntry, entryIndex: number) => {
                              const position = calculateBarPosition(entry.startWeek, entry.endWeek);
                              const colorClasses = getProjectColor(
                                entry.projectName,
                                person.department
                              );
                              const startFmt = fmtBarDate(entry.startWeek);
                              const endFmt = fmtBarDate(entry.endWeek);
                              const barTextSize = getBarTextSize();

                              return (
                                <div
                                  key={`${entry.projectId}-${entryIndex}`}
                                  className={`absolute inset-y-1 rounded border ${colorClasses} overflow-hidden`}
                                  style={position}
                                  title={`${entry.projectName}\nStart: ${startFmt}\nEnd: ${endFmt}`}
                                >
                                  {/* One line: start | name | end */}
                                  <div className={`h-full w-full grid grid-cols-3 items-center px-2 ${barTextSize}`}>
                                    <span className="justify-self-start whitespace-nowrap">
                                      {startFmt}
                                    </span>
                                    <span className="justify-self-center whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                                      {entry.projectName}
                                    </span>
                                    <span className="justify-self-end whitespace-nowrap">
                                      {endFmt}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Optional horizontal nudge buttons */}
        <div className="pointer-events-none absolute bottom-2 right-2 flex gap-1">
          <button
            onClick={() => nudge(-300)}
            className="pointer-events-auto px-2 py-1 text-xs rounded border bg-white shadow"
            title="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => nudge(300)}
            className="pointer-events-auto px-2 py-1 text-xs rounded border bg-white shadow"
            title="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="font-medium">Department Colors:</span>
            {departments.slice(0, 4).map((deptName: string) => {
              const deptColors = getDepartmentColor(deptName);
              return (
                <div key={deptName} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded border ${deptColors.bg} ${deptColors.border}`} />
                  <span>{deptName}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            {departments.slice(4).map((deptName: string) => {
              const deptColors = getDepartmentColor(deptName);
              return (
                <div key={deptName} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded border ${deptColors.bg} ${deptColors.border}`} />
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
