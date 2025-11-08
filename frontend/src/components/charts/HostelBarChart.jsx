import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
  count: {
    label: "Complaints",
  },
}

const getShortHostelName = (fullName) => {
  const shortcuts = {
    "Desasiswa Aman Damai": "AD",
    "Desasiswa Fajar Harapan": "FH", 
    "Desasiswa Bakti Permai": "BP",
    "Desasiswa Cahaya Gemilang": "CG",
    "Desasiswa Indah Kembara": "IK",
    "Desasiswa Restu": "RS",
    "Desasiswa Saujana": "SJ",
    "Desasiswa Tekun": "TK"
  };
  return shortcuts[fullName] || fullName;
}

// Function to get full hostel name from short name
const getFullHostelName = (shortName) => {
  const fullNames = {
    "AD": "Desasiswa Aman Damai",
    "FH": "Desasiswa Fajar Harapan",
    "BP": "Desasiswa Bakti Permai", 
    "CG": "Desasiswa Cahaya Gemilang",
    "IK": "Desasiswa Indah Kembara",
    "RS": "Desasiswa Restu",
    "SJ": "Desasiswa Saujana",
    "TK": "Desasiswa Tekun"
  };
  return fullNames[shortName] || shortName;
}

export function HostelBarChart({ data }) {
  const chartData = data.map(item => ({
    ...item,
    shortHostel: getShortHostelName(item.hostel),
    fullHostel: item.hostel 
  }));

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Complaints by Hostel</CardTitle>
        <CardDescription>Number of complaints per hostel</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ left: 10, right: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(270, 76%, 53%)" />
                <stop offset="100%" stopColor="hsl(270, 76%, 70%)" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="shortHostel"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              interval={0}
              fontSize={12}
            />
            <ChartTooltip 
              cursor={false} 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                      <p className="font-semibold text-gray-900">{data.fullHostel}</p>
<p className="text-xs text-gray-600">
  Complaints: <span className="font-semibold">{data.count}</span>
</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="count"
              fill="url(#barGradient)"
              strokeWidth={2}
              radius={8}
              activeBar={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col items-center gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          Tracking hostel issues <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none text-center">
          Showing total complaints by hostel
        </div>
      </CardFooter>
    </Card>
  )
}
