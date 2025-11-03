import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Complaints",
  },
}

const COLORS = ["#0047FF", "#336CFF", "#5B8EFF", "#A4C2FF"]

export function FacilityPieChart({ data, total }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Facilities</CardTitle>
        <CardDescription>Complaints by facility type</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-3xl font-bold"
            >
              {total}
            </text>
            <text
              x="50%"
              y="56%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-sm"
            >
              Complaints
            </text>
          </PieChart>
        </ChartContainer>
      </CardContent>
<CardFooter className="flex flex-col items-center gap-2 text-sm">
  <div className="flex items-center gap-2 leading-none font-medium">
    Tracking facility issues <TrendingUp className="h-4 w-4" />
  </div>
  <div className="text-muted-foreground leading-none">
    Showing total complaints for all facilities
  </div>
</CardFooter>

    </Card>
  )
}