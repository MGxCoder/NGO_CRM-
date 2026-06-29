import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
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
import { Plus, Search, Filter, Mail, Phone, TrendingUp } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface Donor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  status: string;
  health_score: number;
  engagement_score: number;
  last_donation_date: string | null;
  total_donations: number;
  donation_frequency: string | null;
  preferred_communication: string | null;
  interests: string | null;
  notes: string | null;
}

export function DonorManagement() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setDonors(data);
    setLoading(false);
  };

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
    const fullName = `${donor.first_name} ${donor.last_name}`.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      fullName.includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = countryFilter === "all" || donor.country === countryFilter;
    const matchesStatus = statusFilter === "all" || donor.status === statusFilter;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const getInitials = (donor: Donor) =>
    `${donor.first_name[0] ?? ""}${donor.last_name[0] ?? ""}`.toUpperCase();

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
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading donors...</div>
          ) : filteredDonors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No donors found.{" "}
              <button
                className="text-[#6C63FF] underline"
                onClick={() => navigate("/dashboard/donors/add")}
              >
                Add your first donor
              </button>
            </div>
          ) : (
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
                            {getInitials(donor)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{donor.first_name} {donor.last_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{donor.email}</TableCell>
                    <TableCell>{donor.country ?? "—"}</TableCell>
                    <TableCell>{donor.last_donation_date ?? "—"}</TableCell>
                    <TableCell className="font-medium">
                      ${donor.total_donations.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[60px]">
                          <div
                            className={`h-2 rounded-full ${getHealthScoreColor(donor.health_score)} bg-current`}
                            style={{ width: `${donor.health_score}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getHealthScoreColor(donor.health_score)}`}>
                          {donor.health_score}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{donor.engagement_score}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(donor.status)}>{donor.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
                      {getInitials(selectedDonor)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{selectedDonor.first_name} {selectedDonor.last_name}</SheetTitle>
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
                    {selectedDonor.phone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{selectedDonor.phone}</span>
                      </div>
                    )}
                    {selectedDonor.country && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country:</span>
                        <span>{selectedDonor.country}</span>
                      </div>
                    )}
                    {selectedDonor.donation_frequency && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Donation Frequency:</span>
                        <span>{selectedDonor.donation_frequency}</span>
                      </div>
                    )}
                    {selectedDonor.preferred_communication && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Preferred Contact:</span>
                        <span>{selectedDonor.preferred_communication}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedDonor.status)}>
                        {selectedDonor.status}
                      </Badge>
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
                        <span className={`font-medium ${getHealthScoreColor(selectedDonor.health_score)}`}>
                          {selectedDonor.health_score}/100
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getHealthScoreColor(selectedDonor.health_score)} bg-current`}
                          style={{ width: `${selectedDonor.health_score}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement Score</span>
                        <span className="font-medium">{selectedDonor.engagement_score}/100</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-[#4F8CFF]"
                          style={{ width: `${selectedDonor.engagement_score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Donation Summary */}
                <div>
                  <h3 className="font-semibold mb-3">Donation Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Donated:</span>
                      <span className="font-medium">${selectedDonor.total_donations.toLocaleString()}</span>
                    </div>
                    {selectedDonor.last_donation_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Donation:</span>
                        <span>{selectedDonor.last_donation_date}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedDonor.interests && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Interests</h3>
                      <p className="text-sm text-muted-foreground">{selectedDonor.interests}</p>
                    </div>
                  </>
                )}

                {selectedDonor.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <p className="text-sm text-muted-foreground">{selectedDonor.notes}</p>
                    </div>
                  </>
                )}

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
                        Share impact stories about education programs — this donor has shown higher engagement with this topic.
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
