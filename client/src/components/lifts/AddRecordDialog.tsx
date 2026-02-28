import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { useAddPersonalRecord } from '@/hooks/use-lifts';
import { useUnit } from '@/hooks/use-profile';
import { toKg } from '@/lib/units';

interface Lift {
    id: string;
    name: string;
    category: string;
}

interface AddRecordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lifts: Lift[];
    preselectedLiftId?: string;
}

export function AddRecordDialog({ open, onOpenChange, lifts, preselectedLiftId }: AddRecordDialogProps) {
    const unit = useUnit();
    const [liftId, setLiftId] = useState(preselectedLiftId ?? '');
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('1');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [notes, setNotes] = useState('');

    const addRecord = useAddPersonalRecord();

    const resetForm = () => {
        setLiftId(preselectedLiftId ?? '');
        setWeight('');
        setReps('1');
        setDate(format(new Date(), 'yyyy-MM-dd'));
        setNotes('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const weightNum = parseFloat(weight);
        const repsNum = parseInt(reps, 10);

        if (!liftId || isNaN(weightNum) || weightNum <= 0 || isNaN(repsNum) || repsNum < 1) {
            toast.error('Please fill in all required fields correctly.');
            return;
        }

        addRecord.mutate(
            {
                liftId,
                weight: toKg(weightNum, unit),
                reps: repsNum,
                date,
                notes: notes.trim() || undefined,
            },
            {
                onSuccess: () => {
                    toast.success('Record added successfully!');
                    resetForm();
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error('Failed to add record. Please try again.');
                },
            }
        );
    };

    // Sync preselectedLiftId when dialog opens
    const handleOpenChange = (next: boolean) => {
        if (next && preselectedLiftId) {
            setLiftId(preselectedLiftId);
        }
        onOpenChange(next);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Personal Record</DialogTitle>
                    <DialogDescription>Log a new 1RM or rep record for a lift.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground">Lift</label>
                        <Select value={liftId} onValueChange={setLiftId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a lift" />
                            </SelectTrigger>
                            <SelectContent>
                                {lifts.map((lift) => (
                                    <SelectItem key={lift.id} value={lift.id}>
                                        {lift.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-foreground">Weight ({unit})</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="0.0"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-foreground">Reps</label>
                            <input
                                type="number"
                                step="1"
                                min="1"
                                value={reps}
                                onChange={(e) => setReps(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground">Date</label>
                        <DatePicker value={date} onChange={(v) => setDate(v)} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground">Notes (optional)</label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Competition, training notes..."
                            maxLength={500}
                            rows={2}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={addRecord.isPending}>
                            {addRecord.isPending ? 'Saving...' : 'Save Record'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
