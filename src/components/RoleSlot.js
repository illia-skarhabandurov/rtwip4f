import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDrop } from 'react-dnd';
import { Plus, X } from "lucide-react";
import { PersonCard } from "./PersonCard";
import { Button } from "./ui/button";
export function RoleSlot({ role, onAssign, onUnassign }) {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'person',
        drop: (item) => {
            if (onAssign) {
                onAssign(role.id, item.person);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));
    if (role.assignedPerson) {
        return (_jsxs("div", { className: "relative group", children: [_jsx(PersonCard, { person: role.assignedPerson, showRole: false, compact: true, draggable: false }), onUnassign && (_jsx(Button, { variant: "ghost", size: "sm", className: "absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full", onClick: () => onUnassign(role.id), children: _jsx(X, { className: "h-2.5 w-2.5 sm:h-3 sm:w-3" }) }))] }));
    }
    return (_jsx("div", { ref: drop, className: `w-full h-6 sm:h-8 border-2 border-dashed rounded transition-all ${isOver && canDrop
            ? 'border-blue-400 bg-blue-50'
            : canDrop
                ? 'border-gray-300 hover:border-gray-400'
                : 'border-gray-200'} ${role.status === 'critical' ? 'border-red-300 bg-red-50' : ''}`, children: _jsx(Button, { variant: "ghost", size: "sm", className: "w-full h-full text-gray-500 hover:text-gray-700 flex items-center justify-center", disabled: !canDrop, children: _jsx(Plus, { className: "h-2.5 w-2.5 sm:h-3 sm:w-3" }) }) }));
}
