import { Button } from "@/components/ui/button"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  complaints: {
    label: "Complaints",
    color: "hsl(270, 76%, 53%)",
  },
}

export function ComplaintsTrendChart({ data, timeRange, onTimeRangeChange }) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Complaints Trend</CardTitle>
          <CardDescription>
            Showing complaints for the last {timeRange === "7d" ? "7 days" : "30 days"}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => onTimeRangeChange("30d")}
            className={timeRange === "30d" ? "bg-purple-600 hover:bg-purple-700 text-white" : "border-purple-600 text-purple-600 hover:bg-purple-50"}
          >
            Last 30 days
          </Button>
          <Button
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => onTimeRangeChange("7d")}
            className={timeRange === "7d" ? "bg-purple-600 hover:bg-purple-700 text-white" : "border-purple-600 text-purple-600 hover:bg-purple-50"}
          >
            Last 7 days
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillComplaints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(270, 76%, 53%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(270, 76%, 53%)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
              }
            />
            <Area
              dataKey="complaints"
              type="natural"
              fill="url(#fillComplaints)"
              stroke="hsl(270, 76%, 53%)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}