import { Search, Filter, Info, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { countries, getDepartments, projectStatuses } from "../data/mockData";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    country: string;
    project: string;
    position: string;
    department: string;
    status: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export function TopBar({ searchQuery, onSearchChange, filters, onFilterChange }: TopBarProps) {
  const departments = getDepartments();
  
  return (
    <div className="h-14 sm:h-16 bg-white border-b border-border px-3 sm:px-4 md:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      {/* Filters - Stack vertically on small screens */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 order-2 sm:order-1">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        {/* Filter selects - responsive widths and stacking */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Select value={filters.country} onValueChange={(value) => onFilterChange('country', value)}>
            <SelectTrigger className="w-28 sm:w-32 text-xs sm:text-sm">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={`country-${country}`} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.project} onValueChange={(value) => onFilterChange('project', value)}>
            <SelectTrigger className="w-32 sm:w-36 md:w-40 text-xs sm:text-sm">
              <SelectValue placeholder="Project Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="downtown">Downtown Office Complex</SelectItem>
              <SelectItem value="residential">Residential Tower Phase 2</SelectItem>
              <SelectItem value="infrastructure">Infrastructure Upgrade</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.department} onValueChange={(value) => onFilterChange('department', value)}>
            <SelectTrigger className="w-32 sm:w-36 md:w-40 text-xs sm:text-sm">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((deptName) => (
                <SelectItem key={`department-${deptName}`} value={deptName}>{deptName}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
            <SelectTrigger className="w-28 sm:w-32 md:w-36 text-xs sm:text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {projectStatuses.map((status) => (
                <SelectItem key={`status-${status}`} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search and Actions - Stack vertically on small screens */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 order-1 sm:order-2 w-full sm:w-auto">
        {/* Search - full width on small screens */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or position title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-56 md:w-64 text-sm"
          />
        </div>

        {/* Actions - responsive layout */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
            <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Status Legend</span>
            <span className="sm:hidden">Legend</span>
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">John Doe</span>
            <span className="text-xs sm:text-sm font-medium sm:hidden">JD</span>
            <Avatar className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback className="text-xs">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}