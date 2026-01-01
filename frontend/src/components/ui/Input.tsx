'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, ...props }, ref) => {
        if (icon) {
            return (
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                        {icon}
                    </div>
                    <input
                        ref={ref}
                        className={cn('input pl-10', className)}
                        {...props}
                    />
                </div>
            );
        }

        return (
            <input
                ref={ref}
                className={cn('input', className)}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';

interface SearchInputProps extends Omit<InputProps, 'icon'> { }

export function SearchInput({ className, ...props }: SearchInputProps) {
    return (
        <Input
            icon={<Search size={18} />}
            placeholder="Search..."
            className={className}
            {...props}
        />
    );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, options, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={cn(
                    'input appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%2371717a\' d=\'M3 4.5L6 8l3-3.5H3z\'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.75rem_center] pr-8',
                    className
                )}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        );
    }
);

Select.displayName = 'Select';
