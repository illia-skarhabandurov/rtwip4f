import {
  Home,
  Eye,
  Radar,
  Users,
  Calendar,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navigationItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "clarity", label: "Clarity", icon: Eye },
  { id: "radar", label: "Radar", icon: Radar },
  { id: "resource-tracker", label: "Resource Tracker", icon: Users },
  { id: "availability-tracker", label: "Availability Tracker", icon: Calendar },
  { id: "workforce-planning", label: "Workforce Planning Timeline", icon: BarChart3 },
  { id: "pcs", label: "PCS", icon: FileText },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col transition-[width] duration-200 ease-in-out",
        "h-[100dvh]", // better than 100vh on iPad Safari
        // Responsive widths: smaller on tablets, standard on desktop
        collapsed 
          ? "w-12 sm:w-14 md:w-16" 
          : "w-56 sm:w-60 md:w-64 lg:w-72 xl:w-80"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "border-b border-sidebar-border flex items-center",
          collapsed 
            ? "p-2 sm:p-2.5 md:p-3 justify-center" 
            : "p-4 sm:p-5 md:p-6 justify-between"
        )}
      >
        <div className={cn("flex items-baseline gap-2", collapsed && "overflow-hidden")}>
          <h1 className={cn(
            "text-lg sm:text-xl font-semibold text-sidebar-foreground", 
            collapsed && "sr-only"
          )}>
            Moonshot
          </h1>
          {!collapsed && (
            <p className="text-xs text-sidebar-foreground/60 mt-1 hidden sm:block">
              v2.1.0
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10",
            !collapsed && "ml-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 space-y-1 sm:space-y-2", 
        collapsed 
          ? "p-1.5 sm:p-2" 
          : "p-3 sm:p-4"
      )}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <Button
              key={item.id}
              variant="ghost"
              aria-label={item.label}
              title={collapsed ? item.label : undefined} // tooltip when collapsed
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full font-normal",
                // Responsive heights
                "h-8 sm:h-9 md:h-10",
                collapsed 
                  ? "justify-center p-0" 
                  : "justify-start p-2 sm:p-3",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 sm:h-5 sm:w-5", 
                !collapsed && "mr-2 sm:mr-3"
              )} />
              {!collapsed && (
                <span className="truncate text-sm sm:text-base">
                  {item.label}
                </span>
              )}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
