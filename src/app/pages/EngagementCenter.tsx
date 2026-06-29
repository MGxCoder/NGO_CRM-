import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Cake,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Mail,
  Phone as PhoneIcon,
  MessageCircle,
  Plus,
  Send,
} from "lucide-react";
import { Separator } from "../components/ui/separator";

const upcomingBirthdays = [
  { name: "Sarah Johnson", date: "June 28", avatar: "SJ" },
  { name: "Michael Chen", date: "June 30", avatar: "MC" },
  { name: "David Brown", date: "July 2", avatar: "DB" },
];

const donationAnniversaries = [
  { name: "Emma Wilson", years: "3 years", date: "June 27", avatar: "EW" },
  { name: "Lisa Anderson", years: "1 year", date: "July 1", avatar: "LA" },
];

const pendingFollowups = [
  { name: "David Brown", reason: "At-risk donor - no activity in 90 days", priority: "high", avatar: "DB" },
  { name: "John Smith", reason: "Requested more information on programs", priority: "medium", avatar: "JS" },
  { name: "Mary Williams", reason: "Donation anniversary approaching", priority: "low", avatar: "MW" },
];

const surveyResponses = [
  { name: "Sarah Johnson", response: "Very satisfied with transparency", rating: 5, avatar: "SJ" },
  { name: "Michael Chen", response: "Would like more frequent updates", rating: 4, avatar: "MC" },
];

const automationSteps = [
  { id: 1, title: "Welcome Email", trigger: "New donor signup", status: "active", sent: 847 },
  { id: 2, title: "Thank You Email", trigger: "Donation received", status: "active", sent: 2341 },
  { id: 3, title: "Monthly Impact Report", trigger: "1st of each month", status: "active", sent: 1923 },
  { id: 4, title: "Birthday Greeting", trigger: "Donor birthday", status: "active", sent: 156 },
  { id: 5, title: "Re-engagement Campaign", trigger: "90 days inactive", status: "active", sent: 89 },
];

export function EngagementCenter() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Engagement Center</h1>
          <p className="text-muted-foreground">Manage donor engagement and automate communications</p>
        </div>
        <Button onClick={() => navigate("/dashboard/campaigns?tab=direct-mail")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Engagement Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Upcoming Birthdays */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Upcoming Birthdays</CardTitle>
              <Cake className="w-5 h-5 text-[#6C63FF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBirthdays.map((birthday, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[#6C63FF]/10 text-[#6C63FF] text-xs">
                      {birthday.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{birthday.name}</p>
                    <p className="text-xs text-muted-foreground">{birthday.date}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Donation Anniversaries */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Anniversaries</CardTitle>
              <Calendar className="w-5 h-5 text-[#4F8CFF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {donationAnniversaries.map((anniversary, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[#4F8CFF]/10 text-[#4F8CFF] text-xs">
                      {anniversary.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{anniversary.name}</p>
                    <p className="text-xs text-muted-foreground">{anniversary.years} · {anniversary.date}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Follow-ups */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pending Follow-ups</CardTitle>
              <CheckCircle2 className="w-5 h-5 text-[#A29DFF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingFollowups.map((followup, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-[#A29DFF]/10 text-[#A29DFF] text-xs">
                        {followup.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium flex-1">{followup.name}</p>
                    <Badge
                      className={`text-xs ${
                        followup.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : followup.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {followup.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground pl-8">{followup.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Survey Responses */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Survey Responses</CardTitle>
              <MessageSquare className="w-5 h-5 text-[#7FB8FF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {surveyResponses.map((survey, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-[#7FB8FF]/10 text-[#7FB8FF] text-xs">
                        {survey.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium flex-1">{survey.name}</p>
                    <div className="flex">
                      {[...Array(survey.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pl-8">{survey.response}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Builder */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Campaign Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="email">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="whatsapp">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="sms">
                <PhoneIcon className="w-4 h-4 mr-2" />
                SMS
              </TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="space-y-4 mt-4">
              <div className="border rounded-lg p-6 bg-gray-50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Email Campaign</h3>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Template picker opened.")}>Choose Template</Button>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject Line</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                      placeholder="Your Impact This Month"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recipients</label>
                    <select className="w-full px-3 py-2 border rounded-lg bg-white">
                      <option>All Active Donors (1,923)</option>
                      <option>New Donors (156)</option>
                      <option>At-Risk Donors (89)</option>
                      <option>Major Donors (45)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Schedule</label>
                    <select className="w-full px-3 py-2 border rounded-lg bg-white">
                      <option>Send Immediately</option>
                      <option>Schedule for Later</option>
                      <option>Send on Donor's Timezone</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-[#6C63FF] hover:bg-[#5A52D5]" onClick={() => toast.success("Email campaign queued for the selected segment.")}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Campaign
                    </Button>
                    <Button variant="outline" onClick={() => toast.success("Campaign preview generated.")}>Preview</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="whatsapp" className="space-y-4 mt-4">
              <div className="border rounded-lg p-6 bg-gray-50 text-center py-12">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">WhatsApp campaign builder coming soon</p>
              </div>
            </TabsContent>
            <TabsContent value="sms" className="space-y-4 mt-4">
              <div className="border rounded-lg p-6 bg-gray-50 text-center py-12">
                <PhoneIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">SMS campaign builder coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Automation Timeline */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Automation Timeline</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Automation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationSteps.map((step) => (
              <div key={step.id} className="flex items-start gap-4 border-l-2 border-[#6C63FF] pl-4 pb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium">{step.title}</h4>
                    <Badge className="bg-green-100 text-green-800">{step.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Trigger: {step.trigger}</p>
                  <p className="text-xs text-muted-foreground">Sent to {step.sent.toLocaleString()} donors</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toast.success(`${step.title} opened for editing.`)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => toast.success(`${step.title} stats opened.`)}>View Stats</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
