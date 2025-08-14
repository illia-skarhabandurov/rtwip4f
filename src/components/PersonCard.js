import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDrag } from 'react-dnd';
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
export function PersonCard({ person, showRole = true, compact = false, draggable = true }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'person',
        item: { person },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: draggable,
    }));
    const getStatusColor = (status) => {
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
    const getStatusText = (status) => {
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
        return (_jsxs("div", { ref: draggable ? drag : undefined, className: `flex items-center gap-2 p-1.5 sm:p-2 bg-white rounded border border-border hover:shadow-sm transition-all cursor-pointer ${isDragging ? 'opacity-50' : ''} ${draggable ? 'hover:scale-105' : ''}`, children: [_jsxs(Avatar, { className: "h-5 w-5 sm:h-6 sm:w-6", children: [_jsx(AvatarImage, { src: person.avatar, alt: person.name }), _jsx(AvatarFallback, { className: "text-xs", children: person.name.split(' ').map(n => n[0]).join('') })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-xs font-medium truncate", children: person.name }), showRole && (_jsx("div", { className: "text-xs text-muted-foreground truncate", children: person.role }))] }), _jsx("div", { className: `w-2 h-2 rounded-full ${getStatusColor(person.status)}` })] }));
    }
    return (_jsx("div", { ref: draggable ? drag : undefined, className: `bg-white rounded-lg border border-border p-3 sm:p-4 hover:shadow-sm transition-all cursor-pointer ${isDragging ? 'opacity-50' : ''} ${draggable ? 'hover:scale-105' : ''}`, children: _jsxs("div", { className: "flex items-start gap-2 sm:gap-3", children: [_jsxs(Avatar, { className: "h-8 w-8 sm:h-10 sm:w-10", children: [_jsx(AvatarImage, { src: person.avatar, alt: person.name }), _jsx(AvatarFallback, { className: "text-xs sm:text-sm", children: person.name.split(' ').map(n => n[0]).join('') })] }), _jsxs("div", { className: "flex-1 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-medium text-sm sm:text-base", children: person.name }), _jsx("div", { className: `w-2 h-2 rounded-full ${getStatusColor(person.status)}` })] }), showRole && (_jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: person.role })), _jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [_jsx(Calendar, { className: "h-3 w-3" }), _jsxs("span", { className: "hidden sm:inline", children: ["Available: ", new Date(person.availabilityDate).toLocaleDateString()] }), _jsxs("span", { className: "sm:hidden", children: ["From: ", new Date(person.availabilityDate).toLocaleDateString()] })] }), person.currentProjects.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: person.currentProjects.map((project) => (_jsx(Badge, { variant: "secondary", className: "text-xs", children: project }, project))) })), _jsx(Badge, { variant: "outline", className: "text-xs", children: getStatusText(person.status) })] })] }) }));
}
