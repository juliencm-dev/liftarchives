import { useState } from 'react';
import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date', className, disabled }: DatePickerProps) {
    const [open, setOpen] = useState(false);

    const date = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    disabled={disabled}
                    className={cn(
                        'h-10 w-full justify-start rounded-lg border border-border/60 bg-secondary/50 px-3 text-left text-sm font-normal text-foreground hover:bg-secondary/70 hover:text-foreground',
                        !value && 'text-muted-foreground hover:text-muted-foreground',
                        className
                    )}
                >
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    {date ? format(date, 'MMMM d, yyyy') : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto rounded-xl p-2" align="start" side="top" sideOffset={8}>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(day) => {
                        if (day) {
                            onChange?.(format(day, 'yyyy-MM-dd'));
                        }
                        setOpen(false);
                    }}
                    defaultMonth={date}
                    captionLayout="dropdown"
                    startMonth={new Date(1940, 0)}
                    endMonth={new Date(new Date().getFullYear(), 11)}
                />
            </PopoverContent>
        </Popover>
    );
}
