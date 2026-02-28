"use client"

import { TrendingUp, BarChart3 } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipProps,
} from "recharts"

export interface ChartDataPoint {
  date: string
  weight: number
  label?: string
}

interface ProgressionChartProps {
  liftName?: string
  data: ChartDataPoint[]
  unit?: string
}

function CustomTooltip({
  active,
  payload,
  unit = "kg",
}: TooltipProps<number, string> & { unit?: string }) {
  if (!active || !payload || !payload.length) return null
  const point = payload[0]
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{point.payload.label || point.payload.date}</p>
      <p className="text-sm font-bold text-foreground">
        {point.value}
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          {unit}
        </span>
      </p>
    </div>
  )
}

export function ProgressionChart({
  liftName,
  data,
  unit = "kg",
}: ProgressionChartProps) {
  const hasData = data.length > 0

  // Calculate progression stats
  const firstWeight = hasData ? data[0].weight : 0
  const lastWeight = hasData ? data[data.length - 1].weight : 0
  const totalGain = lastWeight - firstWeight
  const maxWeight = hasData ? Math.max(...data.map((d) => d.weight)) : 0

  return (
    <Card className="gap-0 py-0 border-border/50">
      <CardHeader className="px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              {liftName ? `${liftName} Progression` : "Progression"}
            </CardTitle>
            <CardDescription className="text-xs">
              Weight progression over time
            </CardDescription>
          </div>
          {hasData && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Best
                </p>
                <p className="text-sm font-bold tabular-nums text-foreground">
                  {maxWeight}
                  <span className="text-xs font-normal text-muted-foreground">
                    {unit}
                  </span>
                </p>
              </div>
              {totalGain !== 0 && (
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Gain
                  </p>
                  <p className="flex items-center gap-1 text-sm font-bold tabular-nums text-emerald-400">
                    <TrendingUp className="size-3" />
                    {totalGain > 0 ? "+" : ""}
                    {totalGain}
                    <span className="text-xs font-normal">{unit}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4 sm:px-4">
        {hasData ? (
          <div className="h-48 w-full sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 8, right: 12, bottom: 0, left: -16 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2a2520"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8a8078", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8a8078", fontSize: 11 }}
                  domain={["dataMin - 2", "dataMax + 2"]}
                  dx={-4}
                />
                <Tooltip content={<CustomTooltip unit={unit} />} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#d4a853"
                  strokeWidth={2}
                  dot={{
                    fill: "#d4a853",
                    stroke: "#0a0a0a",
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{
                    fill: "#d4a853",
                    stroke: "#0a0a0a",
                    strokeWidth: 2,
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center gap-2 sm:h-64">
            <BarChart3 className="size-10 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">
              No records yet
            </p>
            <p className="text-xs text-muted-foreground/70">
              {liftName
                ? `Add a PR to ${liftName} to see progression`
                : "Select a lift and add records to see progression"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
