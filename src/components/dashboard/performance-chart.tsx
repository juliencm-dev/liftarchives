"use client";

import { Line, CartesianGrid, XAxis, YAxis, LineChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { LiftDetailsRecord } from "./lift-analyzer";

export default function PerformanceChart({
  data,
}: {
  data: LiftDetailsRecord;
}) {
  const chartConfig = {
    potential: {
      label: "Potential Max",
      color: "#c4b5fd",
    },
    current: {
      label: "Current Max",
      color: !data.isGreater ? "#f87171" : "#22c55e",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className='w-full'>
      <LineChart
        accessibilityLayer
        data={data.chartData}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='date'
          hide={true}
        />
        <YAxis hide={true} />
        <ChartTooltip content={<ChartTooltipContent indicator='dashed' />} />
        <Line
          dataKey='potential'
          stroke='var(--color-potential)'
          strokeWidth={3}
          dot={false}
        />
        <Line
          dataKey='current'
          stroke='var(--color-current)'
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
