import { useState } from 'react';
import { useAllLifts, useCreateLift } from '@/hooks/use-lifts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExercisePickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (liftId: string, liftName: string, parentLiftId: string | null, isCore: boolean) => void;
    /** When true, the picker stays open after selection so user can add multiple movements quickly. */
    stayOpen?: boolean;
}

const CATEGORIES = ['olympic', 'powerlifting', 'accessory'] as const;

export function ExercisePicker({ open, onClose, onSelect, stayOpen = false }: ExercisePickerProps) {
    const { data: lifts, isLoading } = useAllLifts();
    const createLift = useCreateLift();
    const [search, setSearch] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCategory, setNewCategory] = useState<(typeof CATEGORIES)[number]>('accessory');
    const [newParentLiftId, setNewParentLiftId] = useState<string>('');

    // Core lifts available as parents for custom lifts
    const coreLifts = (lifts || []).filter((l) => l.isCore);

    const filtered = (lifts || []).filter((l) => l.name.toLowerCase().includes(search.toLowerCase()));

    const grouped = CATEGORIES.reduce(
        (acc, cat) => {
            const items = filtered.filter((l) => l.category === cat);
            if (items.length > 0) acc[cat] = items;
            return acc;
        },
        {} as Record<string, typeof filtered>
    );

    const handleCreate = async () => {
        if (!newName.trim()) return;
        const result = await createLift.mutateAsync({
            name: newName.trim(),
            category: newCategory,
            parentLiftId: newParentLiftId && newParentLiftId !== 'none' ? newParentLiftId : undefined,
        });
        onSelect(result.lift.id, result.lift.name, result.lift.parentLiftId ?? null, result.lift.isCore);
        setNewName('');
        setNewParentLiftId('');
        setShowCreate(false);
        if (!stayOpen) {
            onClose();
        }
    };

    const handleSelect = (lift: { id: string; name: string; parentLiftId: string | null; isCore: boolean }) => {
        onSelect(lift.id, lift.name, lift.parentLiftId, lift.isCore);
        setSearch('');
        if (!stayOpen) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[85dvh] border-border bg-card sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-foreground">Add Exercise</DialogTitle>
                </DialogHeader>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search lifts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-11 border-primary/40 bg-input pl-10 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20"
                        autoFocus
                    />
                </div>

                <div className="-mx-2 max-h-[50dvh] overflow-y-auto px-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="size-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-muted-foreground">No lifts found</p>
                        </div>
                    ) : (
                        <>
                            {Object.entries(grouped).map(([category, items], catIndex) => (
                                <div key={category}>
                                    {catIndex > 0 && <Separator className="my-2 bg-border" />}
                                    <p className="mb-1 px-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        {category}
                                    </p>
                                    {items.map((lift) => (
                                        <button
                                            key={lift.id}
                                            type="button"
                                            onClick={() => handleSelect(lift)}
                                            className={cn(
                                                'w-full rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors',
                                                'hover:bg-primary/15 hover:text-primary'
                                            )}
                                        >
                                            {lift.name}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </>
                    )}
                </div>

                <Separator className="bg-border" />

                <div>
                    {!showCreate ? (
                        <Button
                            variant="ghost"
                            className="w-full gap-2 text-muted-foreground hover:text-primary"
                            onClick={() => {
                                setShowCreate(true);
                                setNewName(search);
                            }}
                        >
                            <Plus className="size-4" />
                            Create new lift
                        </Button>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Lift name"
                                className="h-9 border-border bg-input text-foreground"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <Select
                                    value={newCategory}
                                    onValueChange={(v) => setNewCategory(v as typeof newCategory)}
                                >
                                    <SelectTrigger className="h-9 flex-1 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((c) => (
                                            <SelectItem key={c} value={c}>
                                                {c}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={newParentLiftId} onValueChange={setNewParentLiftId}>
                                    <SelectTrigger className="h-9 flex-1 text-sm">
                                        <SelectValue placeholder="Variation of..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {coreLifts.map((l) => (
                                            <SelectItem key={l.id} value={l.id}>
                                                {l.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleCreate}
                                    disabled={!newName.trim() || createLift.isPending}
                                    className="h-9"
                                >
                                    {createLift.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Create'}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)} className="h-9">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
