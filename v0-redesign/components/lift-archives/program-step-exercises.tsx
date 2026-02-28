"use client"

import { useState } from "react"
import { GripVertical, Trash2, Plus, ChevronDown, ChevronUp, Settings2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ExercisePickerDialog } from "./exercise-picker-dialog"
import type { ProgramDay } from "./program-step-days"

// ─── Types ───

/** A single movement inside a block (e.g., "2 Pull" or "1 Clean") */
export interface BlockMovement {
  id: string
  name: string
  reps: string
}

/** A block is the fundamental unit: A), B), C)... */
export interface ProgramBlock {
  id: string
  /** Auto-assigned letter label: A, B, C... */
  label: string
  /** Number of rounds / sets for this block (e.g., "5" for 5x) */
  sets: string
  /** List of movements in this block */
  movements: BlockMovement[]
  /** "Up to" mode: intensity cap for the whole block */
  upTo: boolean
  upToPercent: string
  upToRpe: string
  /** Optional notes (e.g., "Every 90sec", "From box", "EMOM 15min") */
  notes: string
}

export interface DayExercises {
  dayId: string
  blocks: ProgramBlock[]
}



// ─── Helpers ───

function createMovement(name: string): BlockMovement {
  return { id: crypto.randomUUID(), name, reps: "1" }
}

function createBlock(label: string): ProgramBlock {
  return {
    id: crypto.randomUUID(),
    label,
    sets: "3",
    movements: [],
    upTo: false,
    upToPercent: "",
    upToRpe: "",
    notes: "",
  }
}

function getNextLabel(blocks: ProgramBlock[]): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  return alphabet[blocks.length] ?? `${blocks.length + 1}`
}

// ─── Component ───

interface ProgramStepExercisesProps {
  days: ProgramDay[]
  dayExercises: DayExercises[]
  onDayExercisesChange: (dayExercises: DayExercises[]) => void
}

export function ProgramStepExercises({
  days,
  dayExercises,
  onDayExercisesChange,
}: ProgramStepExercisesProps) {
  const [activeDay, setActiveDay] = useState(days[0]?.id ?? "")
  const [pickerForBlock, setPickerForBlock] = useState<string | null>(null)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set())
  const [showNotesFor, setShowNotesFor] = useState<Set<string>>(new Set())

  const currentDay = dayExercises.find((d) => d.dayId === activeDay) ?? {
    dayId: activeDay,
    blocks: [],
  }
  const currentBlocks = currentDay.blocks

  function updateDay(blocks: ProgramBlock[]) {
    const existing = dayExercises.find((d) => d.dayId === activeDay)
    if (existing) {
      onDayExercisesChange(
        dayExercises.map((d) =>
          d.dayId === activeDay ? { ...d, blocks } : d
        )
      )
    } else {
      onDayExercisesChange([
        ...dayExercises,
        { dayId: activeDay, blocks },
      ])
    }
  }

  function addBlock() {
    const label = getNextLabel(currentBlocks)
    const newBlock = createBlock(label)
    updateDay([...currentBlocks, newBlock])
    // Open picker immediately for the new block
    setPickerForBlock(newBlock.id)
  }

  function removeBlock(blockId: string) {
    const updated = currentBlocks
      .filter((b) => b.id !== blockId)
      // Re-label remaining blocks
      .map((b, i) => ({
        ...b,
        label: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i] ?? `${i + 1}`,
      }))
    updateDay(updated)
  }

  function updateBlock(blockId: string, updates: Partial<ProgramBlock>) {
    updateDay(
      currentBlocks.map((b) =>
        b.id === blockId ? { ...b, ...updates } : b
      )
    )
  }

  function addMovementToBlock(blockId: string, name: string) {
    const block = currentBlocks.find((b) => b.id === blockId)
    if (!block) return
    updateBlock(blockId, {
      movements: [...block.movements, createMovement(name)],
    })
  }

  function removeMovement(blockId: string, movementId: string) {
    const block = currentBlocks.find((b) => b.id === blockId)
    if (!block) return
    updateBlock(blockId, {
      movements: block.movements.filter((m) => m.id !== movementId),
    })
  }

  function updateMovement(
    blockId: string,
    movementId: string,
    field: keyof BlockMovement,
    value: string
  ) {
    const block = currentBlocks.find((b) => b.id === blockId)
    if (!block) return
    updateBlock(blockId, {
      movements: block.movements.map((m) =>
        m.id === movementId ? { ...m, [field]: value } : m
      ),
    })
  }

  function toggleCollapse(blockId: string) {
    setCollapsedBlocks((prev) => {
      const next = new Set(prev)
      if (next.has(blockId)) next.delete(blockId)
      else next.add(blockId)
      return next
    })
  }

  function toggleNotes(blockId: string) {
    setShowNotesFor((prev) => {
      const next = new Set(prev)
      if (next.has(blockId)) next.delete(blockId)
      else next.add(blockId)
      return next
    })
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-3">
      {/* Day tabs */}
      <Tabs value={activeDay} onValueChange={setActiveDay}>
        <TabsList className="h-auto w-full justify-start gap-0 overflow-x-auto rounded-xl border border-border bg-secondary p-1">
          {days.map((day) => {
            const dayEx = dayExercises.find((d) => d.dayId === day.id)
            const count = dayEx?.blocks.length ?? 0
            return (
              <TabsTrigger
                key={day.id}
                value={day.id}
                className="gap-2 rounded-lg px-4 py-2 text-sm data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                {day.name}
                {count > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {/* Block list */}
      <div className="space-y-3">
        {currentBlocks.map((block) => {
          const isCollapsed = collapsedBlocks.has(block.id)
          const showNotes = showNotesFor.has(block.id) || block.notes.length > 0

          return (
            <div
              key={block.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              {/* ─── Block header ─── */}
              <div className="flex items-center gap-2 px-3 py-2.5">
                <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground/30" />

                {/* Letter badge */}
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-mono text-sm font-bold text-primary">
                  {block.label}
                </div>

                {/* Sets input */}
                <div className="flex items-center gap-1">
                  <Input
                    value={block.sets}
                    onChange={(e) => updateBlock(block.id, { sets: e.target.value })}
                    className="h-7 w-10 border-border bg-input px-0 text-center font-mono text-sm font-semibold text-foreground"
                  />
                  <span className="text-xs font-medium text-muted-foreground">x</span>
                </div>

                {/* Spacer + movement count summary */}
                <span className="flex-1 truncate text-xs text-muted-foreground">
                  {block.movements.length === 0
                    ? "No movements"
                    : block.movements.length === 1
                    ? block.movements[0].name
                    : `${block.movements.length} movements`}
                </span>

                {/* Up to toggle */}
                <label
                  className="flex cursor-pointer items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={block.upTo}
                    onCheckedChange={(checked) =>
                      updateBlock(block.id, { upTo: !!checked })
                    }
                    className="size-3.5 border-muted-foreground/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                  />
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Up to
                  </span>
                </label>

                {/* Intensity inputs when upTo is on */}
                {block.upTo && (
                  <div className="flex items-center gap-1">
                    <Input
                      value={block.upToPercent}
                      onChange={(e) =>
                        updateBlock(block.id, { upToPercent: e.target.value })
                      }
                      placeholder="%"
                      className="h-6 w-12 border-border bg-input px-1 text-center text-[11px] font-mono text-foreground"
                    />
                    <Input
                      value={block.upToRpe}
                      onChange={(e) =>
                        updateBlock(block.id, { upToRpe: e.target.value })
                      }
                      placeholder="RPE"
                      className="h-6 w-12 border-border bg-input px-1 text-center text-[11px] font-mono text-foreground"
                    />
                  </div>
                )}

                {/* Notes toggle */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleNotes(block.id)}
                  className={cn(
                    "size-7",
                    showNotes
                      ? "text-primary"
                      : "text-muted-foreground/50 hover:text-muted-foreground"
                  )}
                  title="Add notes"
                >
                  <Settings2 className="size-3.5" />
                </Button>

                {/* Collapse toggle */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleCollapse(block.id)}
                  className="size-7 text-muted-foreground/50 hover:text-muted-foreground"
                >
                  {isCollapsed ? (
                    <ChevronDown className="size-3.5" />
                  ) : (
                    <ChevronUp className="size-3.5" />
                  )}
                </Button>

                {/* Delete block */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBlock(block.id)}
                  className="size-7 text-destructive/50 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              {/* ─── Notes row (optional) ─── */}
              {showNotes && !isCollapsed && (
                <div className="border-t border-border/50 px-3 py-2">
                  <Textarea
                    value={block.notes}
                    onChange={(e) => updateBlock(block.id, { notes: e.target.value })}
                    placeholder="Notes: Every 90sec, From box, EMOM 15min..."
                    rows={1}
                    className="min-h-[32px] resize-none border-0 bg-transparent p-0 text-xs text-muted-foreground placeholder:text-muted-foreground/40 focus-visible:ring-0"
                  />
                </div>
              )}

              {/* ─── Movement list ─── */}
              {!isCollapsed && (
                <div className="border-t border-border/50">
                  {block.movements.length === 0 ? (
                    <div className="px-4 py-5 text-center">
                      <p className="text-sm text-muted-foreground/60">
                        Add movements to this block
                      </p>
                    </div>
                  ) : (
                    <div>
                      {block.movements.map((movement, i) => (
                        <div
                          key={movement.id}
                          className={cn(
                            "group flex items-center gap-2 px-3 py-2",
                            i > 0 && "border-t border-border/30"
                          )}
                        >
                          {/* Reps input */}
                          <Input
                            value={movement.reps}
                            onChange={(e) =>
                              updateMovement(
                                block.id,
                                movement.id,
                                "reps",
                                e.target.value
                              )
                            }
                            className="h-7 w-10 shrink-0 border-border bg-input px-0 text-center font-mono text-sm font-semibold text-foreground"
                          />

                          {/* Movement name */}
                          <span className="flex-1 text-sm font-medium text-foreground">
                            {movement.name}
                          </span>

                          {/* Remove movement */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeMovement(block.id, movement.id)
                            }
                            className="size-6 text-muted-foreground/0 group-hover:text-destructive/60 hover:text-destructive"
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add movement inside block */}
                  <div className="border-t border-border/30 px-3 py-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPickerForBlock(block.id)}
                      className="h-7 w-full gap-1.5 text-xs text-muted-foreground/60 hover:text-primary"
                    >
                      <Plus className="size-3" />
                      Add Movement
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add block button */}
      <Button
        type="button"
        variant="outline"
        onClick={addBlock}
        className="h-12 w-full gap-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
      >
        <Plus className="size-4" />
        Add Block
        {currentBlocks.length > 0 && (
          <span className="font-mono text-xs text-muted-foreground/60">
            ({getNextLabel(currentBlocks)})
          </span>
        )}
      </Button>

      {/* Exercise picker dialog */}
      <ExercisePickerDialog
        open={!!pickerForBlock}
        onOpenChange={(open) => {
          if (!open) setPickerForBlock(null)
        }}
        onSelect={(name) => {
          if (pickerForBlock) {
            addMovementToBlock(pickerForBlock, name)
          }
          // Keep picker open so user can quickly add multiple movements
        }}
      />
    </div>
  )
}
