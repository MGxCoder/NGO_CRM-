import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import {
  Building2,
  Users,
  Mail,
  Bot,
  Plug,
  CreditCard,
  Save,
  Trash2,
  Plus,
} from "lucide-react";
import { Separator } from "../components/ui/separator";

const teamMembers = [
  { name: "John Doe", email: "john.doe@ngo.org", role: "Admin", avatar: "JD" },
  { name: "Jane Smith", email: "jane.smith@ngo.org", role: "Manager", avatar: "JS" },
  { name: "Bob Johnson", email: "bob.johnson@ngo.org", role: "Member", avatar: "BJ" },
];

const integrations = [
  { name: "Stripe", description: "Payment processing", status: "connected", logo: "💳" },
  { name: "Mailchimp", description: "Email marketing", status: "connected", logo: "✉️" },
  { name: "Slack", description: "Team notifications", status: "not-connected", logo: "💬" },
  { name: "Zapier", description: "Workflow automation", status: "not-connected", logo: "⚡" },
];

export function Settings() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your organization and platform settings</p>
      </div>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList className="grid w-full max-w-3xl grid-cols-6">
          <TabsTrigger value="organization">
            <Building2 className="w-4 h-4 mr-2" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="w-4 h-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Bot className="w-4 h-4 mr-2" />
            AI
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Plug className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Update your organization's information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" defaultValue="Global Hope Foundation" className="bg-input-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgWebsite">Website</Label>
                <Input
                  id="orgWebsite"
                  type="url"
                  defaultValue="https://globalhope.org"
                  className="bg-input-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgEmail">Contact Email</Label>
                  <Input
                    id="orgEmail"
                    type="email"
                    defaultValue="contact@globalhope.org"
                    className="bg-input-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgPhone">Phone</Label>
                  <Input
                    id="orgPhone"
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="bg-input-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgAddress">Address</Label>
                <Input
                  id="orgAddress"
                  defaultValue="123 Main Street, New York, NY 10001"
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgDescription">Description</Label>
                <Textarea
                  id="orgDescription"
                  defaultValue="Global Hope Foundation is dedicated to creating sustainable change in communities worldwide."
                  className="bg-input-background min-h-[100px]"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / Registration Number</Label>
                <Input id="taxId" defaultValue="12-3456789" className="bg-input-background" />
              </div>

              <Button className="bg-[#6C63FF] hover:bg-[#5A52D5]">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your team and their permissions</CardDescription>
                </div>
                <Button className="bg-[#6C63FF] hover:bg-[#5A52D5]">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-[#6C63FF]/10 text-[#6C63FF]">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>{member.role}</Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize your automated email templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  "Welcome Email",
                  "Thank You Email",
                  "Monthly Impact Report",
                  "Birthday Greeting",
                  "Donation Receipt",
                  "Re-engagement Email",
                ].map((template, idx) => (
                  <div key={idx} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <p className="font-medium">{template}</p>
                      <p className="text-sm text-muted-foreground">Last edited 2 days ago</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Preview</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Send from custom domain</p>
                  <p className="text-sm text-muted-foreground">Use your organization's email domain</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Include unsubscribe link</p>
                  <p className="text-sm text-muted-foreground">Required by law in most countries</p>
                </div>
                <Switch defaultChecked disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>AI Assistant Settings</CardTitle>
              <CardDescription>Configure how AI helps your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable AI Recommendations</p>
                  <p className="text-sm text-muted-foreground">
                    Get intelligent suggestions for donor engagement
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-generate Impact Stories</p>
                  <p className="text-sm text-muted-foreground">
                    Let AI draft stories based on program data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Personalized Email Content</p>
                  <p className="text-sm text-muted-foreground">
                    Customize emails based on donor preferences
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Churn Prediction</p>
                  <p className="text-sm text-muted-foreground">
                    Identify donors at risk of leaving
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-gradient-to-br from-[#6C63FF]/5 to-[#4F8CFF]/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 text-[#6C63FF] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">AI Usage This Month</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    You've used 1,247 AI credits out of 5,000 available
                  </p>
                  <div className="bg-white/50 rounded-full h-2 mb-2">
                    <div className="bg-[#6C63FF] h-2 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Resets on July 1st</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect Cre8Gre8 with your favorite tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl">{integration.logo}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                      <Badge className={integration.status === "connected" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {integration.status === "connected" ? "Connected" : "Available"}
                      </Badge>
                    </div>
                    <Button
                      variant={integration.status === "connected" ? "outline" : "default"}
                      size="sm"
                      className={integration.status === "connected" ? "" : "bg-[#6C63FF] hover:bg-[#5A52D5]"}
                    >
                      {integration.status === "connected" ? "Configure" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-gradient-to-br from-[#6C63FF]/5 to-[#4F8CFF]/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Professional Plan</h3>
                    <p className="text-muted-foreground">For growing NGOs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-semibold">$99</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>Up to 5,000 donors</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>Unlimited campaigns</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>AI-powered insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>Priority support</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline">Cancel Subscription</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "June 1, 2024", amount: "$99.00", status: "Paid" },
                  { date: "May 1, 2024", amount: "$99.00", status: "Paid" },
                  { date: "April 1, 2024", amount: "$99.00", status: "Paid" },
                ].map((invoice, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-sm text-muted-foreground">{invoice.status}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{invoice.amount}</p>
                      <Button variant="ghost" size="sm">Download</Button>
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
}
