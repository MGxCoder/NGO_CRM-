import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import { Plus, Search, Filter, Mail, Phone, TrendingUp, MessageSquare } from "lucide-react";
import { Separator } from "../components/ui/separator";

const donors = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    country: "USA",
    lastDonation: "2024-06-20",
    totalDonations: "$2,450",
    healthScore: 92,
    engagementScore: 88,
    status: "Active",
    phone: "+1 (555) 123-4567",
    donationHistory: [
      { date: "2024-06-20", amount: "$500", campaign: "Clean Water Initiative" },
      { date: "2024-05-15", amount: "$250", campaign: "Education Fund" },
      { date: "2024-04-10", amount: "$1,700", campaign: "Emergency Relief" },
    ],
    communications: [
      { date: "2024-06-21", type: "Email", subject: "Thank you for your donation" },
      { date: "2024-06-15", type: "Email", subject: "Monthly Impact Report" },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@email.com",
    country: "Canada",
    lastDonation: "2024-06-18",
    totalDonations: "$5,200",
    healthScore: 95,
    engagementScore: 92,
    status: "Active",
    phone: "+1 (555) 987-6543",
    donationHistory: [
      { date: "2024-06-18", amount: "$1,000", campaign: "Healthcare Access" },
      { date: "2024-05-20", amount: "$1,200", campaign: "Education Fund" },
    ],
    communications: [
      { date: "2024-06-19", type: "Email", subject: "Thank you for your donation" },
    ],
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.w@email.com",
    country: "UK",
    lastDonation: "2024-06-15",
    totalDonations: "$1,800",
    healthScore: 78,
    engagementScore: 75,
    status: "Active",
    phone: "+44 20 1234 5678",
    donationHistory: [
      { date: "2024-06-15", amount: "$300", campaign: "Climate Action" },
      { date: "2024-05-10", amount: "$500", campaign: "Clean Water Initiative" },
    ],
    communications: [],
  },
  {
    id: 4,
    name: "David Brown",
    email: "d.brown@email.com",
    country: "USA",
    lastDonation: "2024-05-25",
    totalDonations: "$3,100",
    healthScore: 65,
    engagementScore: 60,
    status: "At Risk",
    phone: "+1 (555) 456-7890",
    donationHistory: [
      { date: "2024-05-25", amount: "$600", campaign: "Emergency Relief" },
    ],
    communications: [],
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    country: "Australia",
    lastDonation: "2024-06-22",
    totalDonations: "$4,700",
    healthScore: 90,
    engagementScore: 85,
    status: "Active",
    phone: "+61 2 1234 5678",
    donationHistory: [
      { date: "2024-06-22", amount: "$800", campaign: "Education Fund" },
    ],
    communications: [],
  },
];

export function DonorManagement() {
  const navigate = useNavigate();
  const [selectedDonor, setSelectedDonor] = useState<typeof donors[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    if (status === "Active") return "bg-green-100 text-green-800";
    if (status === "At Risk") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = countryFilter === "all" || donor.country === countryFilter;
    const matchesStatus = statusFilter === "all" || donor.status === statusFilter;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Donor Management</h1>
          <p className="text-muted-foreground">Manage and track all your donors in one place</p>
        </div>
        <Button onClick={() => navigate("/dashboard/donors/add")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
          <Plus className="w-4 h-4 mr-2" />
          Add Donor
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-0"
                />
              </div>
            </div>

            {/* Country Filter */}
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[180px] bg-gray-50 border-0">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-gray-50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="At Risk">At Risk</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donors Table */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Last Donation</TableHead>
                <TableHead>Total Donations</TableHead>
                <TableHead>Health Score</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonors.map((donor) => (
                <TableRow
                  key={donor.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedDonor(donor)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-[#6C63FF]/10 text-[#6C63FF]">
                          {donor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{donor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{donor.email}</TableCell>
                  <TableCell>{donor.country}</TableCell>
                  <TableCell>{donor.lastDonation}</TableCell>
                  <TableCell className="font-medium">{donor.totalDonations}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[60px]">
                        <div
                          className={`h-2 rounded-full ${getHealthScoreColor(donor.healthScore)} bg-current`}
                          style={{ width: `${donor.healthScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${getHealthScoreColor(donor.healthScore)}`}>
                        {donor.healthScore}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{donor.engagementScore}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(donor.status)}>{donor.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Donor Profile Drawer */}
      <Sheet open={!!selectedDonor} onOpenChange={() => setSelectedDonor(null)}>
        <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
          {selectedDonor && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-[#6C63FF] text-white text-xl">
                      {selectedDonor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{selectedDonor.name}</SheetTitle>
                    <SheetDescription>{selectedDonor.email}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1 bg-[#6C63FF] hover:bg-[#5A52D5]">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold mb-3">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedDonor.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{selectedDonor.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Country:</span>
                      <span>{selectedDonor.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedDonor.status)}>{selectedDonor.status}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Scores */}
                <div>
                  <h3 className="font-semibold mb-3">Health & Engagement</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Health Score</span>
                        <span className={`font-medium ${getHealthScoreColor(selectedDonor.healthScore)}`}>
                          {selectedDonor.healthScore}/100
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getHealthScoreColor(
                            selectedDonor.healthScore
                          )} bg-current`}
                          style={{ width: `${selectedDonor.healthScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement Score</span>
                        <span className="font-medium">{selectedDonor.engagementScore}/100</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-[#4F8CFF]"
                          style={{ width: `${selectedDonor.engagementScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Donation History */}
                <div>
                  <h3 className="font-semibold mb-3">Donation History</h3>
                  <div className="space-y-3">
                    {selectedDonor.donationHistory.map((donation, idx) => (
                      <div key={idx} className="border-l-2 border-[#6C63FF] pl-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{donation.amount}</span>
                          <span className="text-xs text-muted-foreground">{donation.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{donation.campaign}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium mt-3">Total: {selectedDonor.totalDonations}</p>
                </div>

                <Separator />

                {/* Communication Timeline */}
                <div>
                  <h3 className="font-semibold mb-3">Communication Timeline</h3>
                  {selectedDonor.communications.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDonor.communications.map((comm, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#4F8CFF]/10 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-4 h-4 text-[#4F8CFF]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{comm.subject}</p>
                            <p className="text-xs text-muted-foreground">{comm.type} · {comm.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent communications</p>
                  )}
                </div>

                <Separator />

                {/* AI Suggestions */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#6C63FF]" />
                    AI Suggestions
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-[#6C63FF]/5 rounded-lg p-3">
                      <p className="text-sm">
                        This donor responds best to emails sent on Tuesday mornings. Consider scheduling your next outreach accordingly.
                      </p>
                    </div>
                    <div className="bg-[#4F8CFF]/5 rounded-lg p-3">
                      <p className="text-sm">
                        Share impact stories about education programs - this donor has shown 78% higher engagement with this topic.
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Generate Donor Report
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
