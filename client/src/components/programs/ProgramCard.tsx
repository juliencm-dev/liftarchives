import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Pencil, Play, Square, Trash2, CalendarDays } from 'lucide-react';

interface ProgramCardProps {
    program: {
        id: string;
        name: string;
        description?: string | null;
        weeks: { days: unknown[] }[];
    };
    isActive: boolean;
    onEdit: () => void;
    onActivate: () => void;
    onDeactivate: () => void;
    onDelete: () => void;
}

export function ProgramCard({ program, isActive, onEdit, onActivate, onDeactivate, onDelete }: ProgramCardProps) {
    const dayCount = program.weeks[0]?.days.length ?? 0;
    const weekCount = program.weeks.length;

    return (
        <Card
            className={`group relative border-border bg-card transition-all hover:border-primary/25 hover:shadow-[0_0_20px_rgba(212,168,83,0.04)] ${isActive ? 'border-primary/40 bg-primary/[0.03]' : ''}`}
        >
            <div className="flex items-start justify-between p-5">
                <Link
                    to="/programs/$programId"
                    params={{ programId: program.id }}
                    className="flex flex-1 flex-col gap-2 text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                            <CalendarDays className="size-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-semibold text-foreground">{program.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {dayCount} {dayCount === 1 ? 'day' : 'days'}/week
                                {weekCount > 1 && ` · ${weekCount} weeks`}
                            </p>
                        </div>
                    </div>
                    {program.description && (
                        <p className="line-clamp-2 pl-[52px] text-sm text-muted-foreground/70">{program.description}</p>
                    )}
                </Link>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 shrink-0">
                                <MoreVertical className="size-4" />
                                <span className="sr-only">Program options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 border-border bg-popover">
                            <DropdownMenuItem asChild className="gap-2 text-foreground">
                                <Link to="/programs/$programId" params={{ programId: program.id }}>
                                    <Eye className="size-4" />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onEdit} className="gap-2 text-foreground">
                                <Pencil className="size-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            {isActive ? (
                                <DropdownMenuItem onClick={onDeactivate} className="gap-2 text-foreground">
                                    <Square className="size-4" />
                                    Deactivate
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={onActivate} className="gap-2 text-foreground">
                                    <Play className="size-4" />
                                    Activate
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem
                                onClick={onDelete}
                                className="gap-2 text-destructive focus:text-destructive"
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Card>
    );
}
