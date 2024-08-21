"use client";

import { Line, CartesianGrid, XAxis, YAxis, LineChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  potential: {
    label: "Potential Max",
    color: "#c4b5fd",
  },
  current: {
    label: "Current Max",
    color: "#f87171",
  },
} satisfies ChartConfig;

export default function PerformanceChart({ data }: { data: any }) {
  return (
    <ChartContainer
      config={chartConfig}
      className='w-full'>
      <LineChart
        accessibilityLayer
        data={data}>
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
