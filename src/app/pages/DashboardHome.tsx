import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Users,
  UserCheck,
  Repeat,
  DollarSign,
  TrendingUp,
  FileHeart,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Mail,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const stats = [
  { name: "Total Donors", value: "2,847", change: "+12%", trend: "up", icon: Users, color: "#6C63FF" },
  { name: "Active Donors", value: "1,923", change: "+8%", trend: "up", icon: UserCheck, color: "#4F8CFF" },
  { name: "Recurring Donors", value: "542", change: "+15%", trend: "up", icon: Repeat, color: "#A29DFF" },
  { name: "Monthly Donations", value: "$48,532", change: "-3%", trend: "down", icon: DollarSign, color: "#7FB8FF" },
  { name: "Donor Retention Rate", value: "87.5%", change: "+5%", trend: "up", icon: TrendingUp, color: "#5A52D5" },
  { name: "Impact Stories Published", value: "34", change: "+22%", trend: "up", icon: FileHeart, color: "#6C63FF" },
];

const donationTrend = [
  { month: "Jan", amount: 42000 },
  { month: "Feb", amount: 38000 },
  { month: "Mar", amount: 45000 },
  { month: "Apr", amount: 51000 },
  { month: "May", amount: 49000 },
  { month: "Jun", amount: 48532 },
];

const donorGrowth = [
  { month: "Jan", donors: 2420 },
  { month: "Feb", donors: 2531 },
  { month: "Mar", donors: 2645 },
  { month: "Apr", donors: 2734 },
  { month: "May", donors: 2798 },
  { month: "Jun", donors: 2847 },
];

const engagementData = [
  { name: "Highly Engaged", value: 35, color: "#6C63FF" },
  { name: "Moderately Engaged", value: 45, color: "#4F8CFF" },
  { name: "At Risk", value: 15, color: "#FFA500" },
  { name: "Inactive", value: 5, color: "#FF6B6B" },
];

const recentActivities = [
  { donor: "Sarah Johnson", action: "Made a donation", amount: "$500", time: "2 hours ago" },
  { donor: "Michael Chen", action: "Opened email campaign", amount: null, time: "3 hours ago" },
  { donor: "Emma Wilson", action: "Updated profile", amount: null, time: "5 hours ago" },
  { donor: "David Brown", action: "Made a donation", amount: "$250", time: "1 day ago" },
  { donor: "Lisa Anderson", action: "Shared impact story", amount: null, time: "1 day ago" },
];

const upcomingEmails = [
  { campaign: "Monthly Impact Report", recipients: 1834, scheduled: "Today, 2:00 PM", status: "scheduled" },
  { campaign: "Donor Anniversary", recipients: 45, scheduled: "Tomorrow, 10:00 AM", status: "scheduled" },
  { campaign: "Year-End Appeal", recipients: 2847, scheduled: "Dec 15, 9:00 AM", status: "draft" },
];

const aiRecommendations = [
  {
    title: "12 donors at risk of churning",
    description: "These donors haven't engaged in 90+ days. Consider personalized outreach.",
    action: "View Donors",
  },
  {
    title: "Optimal time to contact major donors",
    description: "Best engagement window: Tuesday-Thursday, 10 AM - 2 PM",
    action: "Schedule Emails",
  },
  {
    title: "5 impact stories ready to share",
    description: "These stories match donor interests and can improve engagement by 23%",
    action: "Review Stories",
  },
];

export function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your donors.</p>
        </div>
        <Button onClick={() => navigate("/dashboard/reports")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{stat.name}</p>
                    <p className="text-2xl font-semibold mb-2">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      {stat.trend === "up" ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm ${
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                    </div>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Donations Trend */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Monthly Donations Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={donationTrend}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#6C63FF" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donor Growth */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Donor Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={donorGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="donors" stroke="#4F8CFF" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Score Distribution */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {engagementData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6C63FF]/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-[#6C63FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.donor}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium text-green-600">{activity.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Automated Emails */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Automated Emails</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEmails.map((email, idx) => (
                <div key={idx} className="border-l-2 border-[#6C63FF] pl-3">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium">{email.campaign}</p>
                    <Badge variant={email.status === "scheduled" ? "default" : "secondary"} className="text-xs">
                      {email.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {email.recipients} recipients
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{email.scheduled}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="border-border/50 shadow-sm bg-gradient-to-br from-[#6C63FF]/5 to-[#4F8CFF]/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#6C63FF]" />
            <CardTitle>AI Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiRecommendations.map((rec, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border border-border/50">
                <h4 className="font-medium mb-2">{rec.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {rec.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
