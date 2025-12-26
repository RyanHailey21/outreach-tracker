import React from 'react';
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from '../constants';
import { Status } from '../types';
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: Status;
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
    const config = STATUS_CONFIG[status];
    if (!config) return null;

    // Use "outline" to provide a base that accepts colors well, or "secondary"
    // We will leverage the fact that standard badges accept className for overrides.
    // We are stripping the 'bg-' part from the constant config to apply it as a text color perhaps, or just using transparent backgrounds.
    // Actually, for the "Elegance" theme, let's just use the classes directly.

    return (
        <Badge
            variant="secondary"
            className={cn(
                "font-medium bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 border-0",
                // We will trust config.colorClass has suitable tailwind classes. 
                // If it has 'bg-blue-100 text-blue-800', it will override secondary styles if specificity allows or via cn merging.
                // Ideally we want subtle backgrounds.
                config.colorClass,
                className
            )}
        >
            <span className={cn('w-1.5 h-1.5 rounded-full mr-2 bg-current opacity-60')} />
            {config.label}
        </Badge>
    );
};
