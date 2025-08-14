import { useDrag } from 'react-dnd';
import { Calendar, User } from "lucide-react";
import { Person } from "../data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface PersonCardProps {
  person: Person;
  showRole?: boolean;
  compact?: boolean;
  draggable?: boolean;
}

export function PersonCard({ person, showRole = true, compact = false, draggable = true }: PersonCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'person',
    item: { person },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: draggable,
  }));

  const getStatusColor = (status: Person['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'partially-available':
        return 'bg-yellow-500';
      case 'overbooked':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Person['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'partially-available':
        return 'Partially Available';
      case 'overbooked':
        return 'Overbooked';
      default:
        return 'Unknown';
    }
  };

  if (compact) {
    return (
      <div
        ref={draggable ? drag : undefined}
        className={`flex items-center gap-2 p-1.5 sm:p-2 bg-white rounded border border-border hover:shadow-sm transition-all cursor-pointer ${
          isDragging ? 'opacity-50' : ''
        } ${draggable ? 'hover:scale-105' : ''}`}
      >
        <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
          <AvatarImage src={person.avatar} alt={person.name} />
          <AvatarFallback className="text-xs">
            {person.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate">{person.name}</div>
          {showRole && (
            <div className="text-xs text-muted-foreground truncate">{person.role}</div>
          )}
        </div>
        <div className={`w-2 h-2 rounded-full ${getStatusColor(person.status)}`} />
      </div>
    );
  }

  return (
    <div
      ref={draggable ? drag : undefined}
      className={`bg-white rounded-lg border border-border p-3 sm:p-4 hover:shadow-sm transition-all cursor-pointer ${
        isDragging ? 'opacity-50' : ''
      } ${draggable ? 'hover:scale-105' : ''}`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
          <AvatarImage src={person.avatar} alt={person.name} />
          <AvatarFallback className="text-xs sm:text-sm">
            {person.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm sm:text-base">{person.name}</h4>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(person.status)}`} />
          </div>
          
          {showRole && (
            <p className="text-xs sm:text-sm text-muted-foreground">{person.role}</p>
          )}
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span className="hidden sm:inline">Available: {new Date(person.availabilityDate).toLocaleDateString()}</span>
            <span className="sm:hidden">From: {new Date(person.availabilityDate).toLocaleDateString()}</span>
          </div>
          
          {person.currentProjects.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {person.currentProjects.map((project) => (
                <Badge key={project} variant="secondary" className="text-xs">
                  {project}
                </Badge>
              ))}
            </div>
          )}
          
          <Badge variant="outline" className="text-xs">
            {getStatusText(person.status)}
          </Badge>
        </div>
      </div>
    </div>
  );
}