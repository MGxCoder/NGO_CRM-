import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Download, Calendar } from "lucide-react";

const retentionData = [
  { month: "Jan", rate: 82 },
  { month: "Feb", rate: 84 },
  { month: "Mar", rate: 86 },
  { month: "Apr", rate: 85 },
  { month: "May", rate: 87 },
  { month: "Jun", rate: 88 },
];

const lifetimeValueData = [
  { segment: "New", value: 450 },
  { segment: "Active", value: 1850 },
  { segment: "Loyal", value: 4200 },
  { segment: "Champion", value: 8500 },
];

const emailPerformance = [
  { month: "Jan", openRate: 24, clickRate: 8 },
  { month: "Feb", openRate: 26, clickRate: 9 },
  { month: "Mar", openRate: 28, clickRate: 10 },
  { month: "Apr", openRate: 25, clickRate: 8 },
  { month: "May", openRate: 30, clickRate: 12 },
  { month: "Jun", openRate: 32, clickRate: 14 },
];

const campaignPerformance = [
  { name: "Monthly Impact", sent: 1923, opened: 1346, clicked: 578, donated: 234 },
  { name: "Emergency Appeal", sent: 2847, opened: 2135, clicked: 987, donated: 456 },
  { name: "Year-End", sent: 2847, opened: 1993, clicked: 854, donated: 398 },
  { name: "Birthday", sent: 156, opened: 134, clicked: 89, donated: 45 },
];

const donationsByCountry = [
  { country: "USA", amount: 125000, color: "#6C63FF" },
  { country: "Canada", amount: 78000, color: "#4F8CFF" },
  { country: "UK", amount: 56000, color: "#A29DFF" },
  { country: "Australia", amount: 42000, color: "#7FB8FF" },
  { country: "Germany", amount: 38000, color: "#5A52D5" },
  { country: "Others", amount: 45000, color: "#D4D4FF" },
];

const recurringDonations = [
  { month: "Jan", oneTime: 28000, monthly: 14000 },
  { month: "Feb", oneTime: 24000, monthly: 14000 },
  { month: "Mar", oneTime: 31000, monthly: 14000 },
  { month: "Apr", oneTime: 35000, monthly: 16000 },
  { month: "May", oneTime: 32000, monthly: 17000 },
  { month: "Jun", oneTime: 30000, monthly: 18532 },
];

const kpis = [
  { name: "Churn Rate", value: "12.5%", change: "-2.3%", trend: "down", target: "< 15%" },
  { name: "Average Donation", value: "$247", change: "+5.2%", trend: "up", target: "> $200" },
  { name: "Donor Health Score", value: "82/100", change: "+3.1%", trend: "up", target: "> 80" },
  { name: "Total Revenue", value: "$384,532", change: "+8.7%", trend: "up", target: "$400K" },
];

export function Analytics() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Analytics</h1>
          <p className="text-muted-foreground">Track performance and gain insights into donor behavior</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="last-30">
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7">Last 7 days</SelectItem>
              <SelectItem value="last-30">Last 30 days</SelectItem>
              <SelectItem value="last-90">Last 90 days</SelectItem>
              <SelectItem value="last-365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.name} className="border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{kpi.name}</p>
                  <p className="text-2xl font-semibold">{kpi.value}</p>
                </div>
                {kpi.trend === "up" ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${
                    kpi.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpi.change} vs last period
                </span>
                <span className="text-xs text-muted-foreground">Target: {kpi.target}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donor Retention Rate */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Donor Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#6C63FF" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donor Lifetime Value */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Donor Lifetime Value by Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={lifetimeValueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="segment" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="value" fill="#4F8CFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Performance */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Email Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={emailPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="openRate" stroke="#6C63FF" strokeWidth={2} name="Open Rate %" />
                <Line type="monotone" dataKey="clickRate" stroke="#4F8CFF" strokeWidth={2} name="Click Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donations by Country */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Donations by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={donationsByCountry}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`}
                >
                  {donationsByCountry.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaignPerformance.map((campaign, idx) => (
                <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {((campaign.donated / campaign.sent) * 100).toFixed(1)}% conversion
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Sent</p>
                      <p className="text-sm font-medium">{campaign.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Opened</p>
                      <p className="text-sm font-medium">{campaign.opened.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Clicked</p>
                      <p className="text-sm font-medium">{campaign.clicked.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Donated</p>
                      <p className="text-sm font-medium text-green-600">{campaign.donated.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#6C63FF] h-2 rounded-full"
                      style={{ width: `${(campaign.donated / campaign.sent) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recurring vs One-Time Donations */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Recurring vs One-Time Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={recurringDonations}>
                <defs>
                  <linearGradient id="colorOneTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F8CFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F8CFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="oneTime"
                  stroke="#6C63FF"
                  fillOpacity={1}
                  fill="url(#colorOneTime)"
                  name="One-Time"
                />
                <Area
                  type="monotone"
                  dataKey="monthly"
                  stroke="#4F8CFF"
                  fillOpacity={1}
                  fill="url(#colorMonthly)"
                  name="Monthly Recurring"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
