import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  Download,
  TrendingUp,
  Star
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { mockComplaints, mockFeedbacks } from '@/data/mockData';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");

  const stats = {
    totalComplaints: mockComplaints.length,
    pending: mockComplaints.filter(c => c.status === 'Pending').length,
    inProgress: mockComplaints.filter(c => c.status === 'In Progress').length,
    resolved: mockComplaints.filter(c => c.status === 'Resolved').length,
  };

  const generateTimeSeriesData = () => {
    const data = [];
    const today = new Date();
    const days = timeRange === "7d" ? 7 : 30;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      data.push({
        date: dateStr,
        complaints: Math.floor(Math.random() * 12) + 3,
      });
    }
    return data;
  };

  const timeSeriesData = useMemo(() => generateTimeSeriesData(), [timeRange]);

  // Pie Chart - Top Facilities
  const facilityData = [...new Set(mockComplaints.map(c => c.facilityType))].map((type, index) => ({
    name: type,
    value: mockComplaints.filter(c => c.facilityType === type).length,
    fill: `hsl(${217 - index * 15}, 91%, ${60 - index * 5}%)`,
  }));

  const totalFacilityComplaints = facilityData.reduce((sum, item) => sum + item.value, 0);

  // Bar Chart - Hostels
  const hostelData = [...new Set(mockComplaints.map(c => c.hostelName))].map(hostel => ({
    hostel: hostel.replace('Desasiswa ', ''),
    count: mockComplaints.filter(c => c.hostelName === hostel).length,
  }));

  const areaChartConfig = {
    complaints: {
      label: "Complaints",
      color: "hsl(217, 91%, 60%)",
    },
  };

  const barChartConfig = {
    count: {
      label: "Complaints",
      color: "hsl(217, 91%, 60%)",
    },
  };

  const pieChartConfig = {
    value: {
      label: "Complaints",
    },
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Resolved': return 'default';
      case 'In Progress': return 'secondary';
      case 'Pending': return 'outline';
      default: return 'outline';
    }
  };

  const getUrgencyVariant = (urgency) => {
    switch (urgency) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of hostel complaints
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComplaints}</div>
            <p className="text-xs text-muted-foreground mt-1">All submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">Being resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Area Chart */}
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
              onClick={() => setTimeRange("30d")}
            >
              Last 30 days
            </Button>
            <Button
              variant={timeRange === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("7d")}
            >
              Last 7 days
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={areaChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="fillComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(217, 91%, 60%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(217, 91%, 60%)"
                    stopOpacity={0.1}
                  />
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
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
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
                      });
                    }}
                  />
                }
              />
              <Area
                dataKey="complaints"
                type="natural"
                fill="url(#fillComplaints)"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bar Chart and Pie Chart Side by Side */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart - Hostels */}
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Hostel</CardTitle>
            <CardDescription>Number of complaints per hostel</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={hostelData} layout="vertical">
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="hostel"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <XAxis type="number" hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  fill="hsl(217, 91%, 60%)" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Top Facilities */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Top Facilities</CardTitle>
            <CardDescription>Complaints by facility type</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={facilityData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  strokeWidth={5}
                >
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-3xl font-bold"
                  >
                    {totalFacilityComplaints}
                  </text>
                  <text
                    x="50%"
                    y="58%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-muted-foreground"
                  >
                    Complaints
                  </text>
                  {facilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Tracking facility issues <TrendingUp className="h-4 w-4" />
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Activity Tabs */}
      <Tabs defaultValue="complaints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="complaints">Recent Complaints</TabsTrigger>
          <TabsTrigger value="feedback">Recent Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="complaints">
          <Card>
            <CardHeader>
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>Latest submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockComplaints.slice(0, 5).map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium">{complaint.facilityType}</p>
                      <p className="text-sm text-muted-foreground">
                        {complaint.studentName} • {complaint.hostelName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {complaint.issueDescription}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant={getUrgencyVariant(complaint.urgencyLevel)} className="w-20 justify-center">
                        {complaint.urgencyLevel}
                      </Badge>
                      <Badge variant={getStatusVariant(complaint.status)} className="w-24 justify-center">
                        {complaint.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>Latest ratings and comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <p className="font-medium">{feedback.studentName}</p>
                        <p className="text-sm text-muted-foreground">
                          Complaint #{feedback.complaintId}
                        </p>
                        <p className="text-sm mt-2">{feedback.comment}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;