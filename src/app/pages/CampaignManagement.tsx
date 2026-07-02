import { useEffect, useMemo, useState } from "react";
import { useTenantId } from "../lib/useTenant";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  Filter,
  Gift,
  HandHeart,
  Megaphone,
  MapPin,
  Search,
  Share2,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type CampaignStatus = "Live" | "Draft" | "Scheduled" | "Completed";

type Campaign = {
  id: string;
  name: string;
  type: string;
  status: CampaignStatus;
  organizer: string;
  eventDate: string;
  deadline: string;
  endDate: string;
  goal: number;
  raised: number;
  donationTarget: number;
  registrations: number;
  volunteers: number;
  conversion: number;
  location: string;
  source: string;
  banner: string;
  description: string;
};

type DbCampaign = {
  id: string;
  name: string;
  type: string;
  status: CampaignStatus;
  organizer: string | null;
  event_date: string | null;
  registration_deadline: string | null;
  end_date?: string | null;
  goal_amount: number;
  amount_raised: number;
  donation_target: number;
  location: string | null;
  source: string | null;
  banner_url: string | null;
  description: string | null;
};

const fallbackCampaigns: Campaign[] = [
  {
    id: "demo-annual-appeal",
    name: "2026 Annual Impact Appeal",
    type: "Annual Appeal",
    status: "Live",
    organizer: "Development Team",
    eventDate: "2026-07-01",
    deadline: "2026-12-20",
    endDate: "2026-12-31",
    goal: 500000,
    raised: 214800,
    donationTarget: 3000,
    registrations: 0,
    volunteers: 18,
    conversion: 11.4,
    location: "Multi-channel",
    source: "Email",
    banner: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=80",
    description: "A year-end fundraising appeal segmented by donor history, capacity, and program interest.",
  },
  {
    id: "demo-event",
    name: "Run for Rural Classrooms",
    type: "Fundraising Event",
    status: "Scheduled",
    organizer: "Education Outreach Team",
    eventDate: "2026-08-18",
    deadline: "2026-08-10",
    endDate: "2026-08-18",
    goal: 85000,
    raised: 58240,
    donationTarget: 1200,
    registrations: 642,
    volunteers: 84,
    conversion: 12.8,
    location: "Austin Community Park",
    source: "Social",
    banner: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
    description: "A community run funding classroom kits, digital learning corners, and teacher training for rural schools.",
  },
  {
    id: "demo-crowdfunding",
    name: "Clean Water Crowdfund",
    type: "Crowdfunding",
    status: "Live",
    organizer: "Field Programs",
    eventDate: "2026-07-15",
    deadline: "2026-09-15",
    endDate: "2026-09-15",
    goal: 125000,
    raised: 71200,
    donationTarget: 2000,
    registrations: 0,
    volunteers: 36,
    conversion: 9.8,
    location: "Public page",
    source: "Website",
    banner: "https://images.unsplash.com/photo-1541919329513-35f7af297129?auto=format&fit=crop&w=1400&q=80",
    description: "A public campaign with social sharing, supporter comments, updates, and a live progress bar.",
  },
];

const chartMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const toNumber = (value: FormDataEntryValue | null) => Number(String(value || "0").replace(/[^0-9.]/g, "")) || 0;
const toText = (value: FormDataEntryValue | null) => String(value || "").trim();

const mapCampaign = (campaign: DbCampaign, counts?: { registrations: number; donations: number; volunteers: number }): Campaign => {
  const registrations = counts?.registrations ?? 0;
  const donations = counts?.donations ?? 0;
  return {
    id: campaign.id,
    name: campaign.name,
    type: campaign.type,
    status: campaign.status,
    organizer: campaign.organizer || "Cre8Gre8 Team",
    eventDate: campaign.event_date || "",
    deadline: campaign.registration_deadline || "",
    endDate: campaign.end_date || campaign.registration_deadline || "",
    goal: Number(campaign.goal_amount || 0),
    raised: Number(campaign.amount_raised || 0),
    donationTarget: Number(campaign.donation_target || 0),
    registrations,
    volunteers: counts?.volunteers ?? 0,
    conversion: registrations ? Number(((donations / registrations) * 100).toFixed(1)) : 0,
    location: campaign.location || "Online",
    source: campaign.source || "Website",
    banner: campaign.banner_url || fallbackCampaigns[0].banner,
    description: campaign.description || "A Cre8Gre8 fundraising campaign.",
  };
};

const statusClass = (status: CampaignStatus) => {
  if (status === "Live") return "bg-green-100 text-green-800";
  if (status === "Scheduled") return "bg-blue-100 text-blue-800";
  if (status === "Draft") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

export function CampaignManagement() {
  const initialTab = new URLSearchParams(window.location.search).get("tab") || "overview";
  const tenantId = useTenantId();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [campaigns, setCampaigns] = useState<Campaign[]>(fallbackCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>(fallbackCampaigns[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void loadCampaigns();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const loadCampaigns = async () => {
    if (!supabase) {
      toast.info("Supabase is not configured. Using demo fundraising data.");
      return;
    }
    // Wait for auth to settle — tenantId is empty before the JWT is ready
    if (!tenantId) return;

    setIsLoading(true);
    try {
      // RLS on the server enforces tenant isolation — no client-side tenant filter needed.
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // Check if error is about missing table - if so, provide helpful guidance
        if (error.message.includes("schema cache") || error.message.includes("Could not find table")) {
          toast.error("Database not configured. Please follow the setup instructions to apply the schema.", {
            description: "See SUPABASE_SETUP.md for help",
            duration: 5000,
          });
          console.error("Schema setup needed:", error.message);
        } else {
          toast.error(`Could not load campaigns: ${error.message}`);
        }
        setIsLoading(false);
        return;
      }

      const withCounts = await Promise.all(
        (data || []).map(async (campaign: DbCampaign) => {
          try {
            // RLS already filters by tenant — no explicit tenant_id needed.
            const [registrations, donations, volunteers] = await Promise.all([
              supabase.from("campaign_registrations").select("id", { count: "exact", head: true }).eq("campaign_id", campaign.id),
              supabase.from("campaign_donations").select("id", { count: "exact", head: true }).eq("campaign_id", campaign.id),
              supabase.from("campaign_volunteers").select("id", { count: "exact", head: true }).eq("campaign_id", campaign.id),
            ]);
            return mapCampaign(campaign, {
              registrations: registrations.count || 0,
              donations: donations.count || 0,
              volunteers: volunteers.count || 0,
            });
          } catch (err) {
            console.warn("Error loading campaign counts, using defaults:", err);
            return mapCampaign(campaign, {
              registrations: 0,
              donations: 0,
              volunteers: 0,
            });
          }
        }),
      );

      if (withCounts.length) {
        setCampaigns(withCounts);
        setSelectedCampaign(withCounts[0]);
      } else {
        setCampaigns([]);
        setSelectedCampaign(fallbackCampaigns[0]);
      }
    } catch (err) {
      console.error("Error loading campaigns:", err);
      toast.error("Failed to load campaigns. Using demo data.");
    }
    setIsLoading(false);
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch = [campaign.name, campaign.type, campaign.organizer].some((value) =>
        value.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      const matchesType = typeFilter === "all" || campaign.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [campaigns, searchQuery, statusFilter, typeFilter]);

  const totals = useMemo(
    () => ({
      raised: campaigns.reduce((sum, campaign) => sum + campaign.raised, 0),
      goal: campaigns.reduce((sum, campaign) => sum + campaign.goal, 0),
      registrations: campaigns.reduce((sum, campaign) => sum + campaign.registrations, 0),
      volunteers: campaigns.reduce((sum, campaign) => sum + campaign.volunteers, 0),
      conversion: campaigns.length ? campaigns.reduce((sum, campaign) => sum + campaign.conversion, 0) / campaigns.length : 0,
    }),
    [campaigns],
  );

  const trendData = useMemo(
    () =>
      chartMonths.map((month, index) => ({
        month,
        donations: Math.round((totals.raised / chartMonths.length) * (0.75 + index * 0.1)),
        registrations: Math.round((totals.registrations / chartMonths.length) * (0.8 + index * 0.08)),
        conversion: Number((totals.conversion * (0.75 + index * 0.06)).toFixed(1)),
      })),
    [totals],
  );

  const sourceData = useMemo(() => {
    const colors = ["#6C63FF", "#4F8CFF", "#12B981", "#F59E0B", "#EF4444"];
    const sources = campaigns.reduce<Record<string, number>>((acc, campaign) => {
      acc[campaign.source] = (acc[campaign.source] || 0) + campaign.raised;
      return acc;
    }, {});
    const total = Object.values(sources).reduce((sum, value) => sum + value, 0) || 1;
    return Object.entries(sources).map(([name, value], index) => ({
      name,
      value: Math.round((value / total) * 100),
      color: colors[index % colors.length],
    }));
  }, [campaigns]);

  const selectedProgress = Math.min(100, Math.round((selectedCampaign.raised / Math.max(selectedCampaign.goal, 1)) * 100));

  const setTab = (tab: string) => {
    setActiveTab(tab);
    window.history.replaceState(null, "", `/dashboard/campaigns?tab=${tab}`);
  };

  const addCampaign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      tenant_id: tenantId,
      name: toText(form.get("campaignName")),
      type: toText(form.get("campaignType")) || "Fundraising Event",
      status: toText(form.get("campaignStatus")) || "Draft",
      goal_amount: toNumber(form.get("goalAmount")),
      banner_url: toText(form.get("banner")) || fallbackCampaigns[0].banner,
      description: toText(form.get("description")),
      organizer: toText(form.get("organizer")) || "Cre8Gre8 Team",
      event_date: toText(form.get("eventDate")) || null,
      registration_deadline: toText(form.get("deadline")) || null,
      end_date: toText(form.get("endDate")) || toText(form.get("deadline")) || null,
      donation_target: Math.round(toNumber(form.get("donationTarget"))),
      location: toText(form.get("location")) || "Online",
      source: toText(form.get("source")) || "Website",
      amount_raised: 0,
    };

    if (!payload.name || !payload.goal_amount) {
      toast.error("Campaign name and target amount are required.");
      return;
    }

    let created: Campaign;
    if (supabase) {
      const { data, error } = await supabase.from("campaigns").insert(payload).select("*").single();
      if (error) {
        toast.error(`Campaign was not saved: ${error.message}`);
        return;
      }
      created = mapCampaign(data as DbCampaign);
      toast.success(`${payload.type} saved to Supabase.`);
    } else {
      created = {
        id: crypto.randomUUID(),
        name: payload.name,
        type: payload.type,
        status: payload.status as CampaignStatus,
        organizer: payload.organizer,
        eventDate: payload.event_date || "",
        deadline: payload.registration_deadline || "",
        endDate: payload.end_date || "",
        goal: payload.goal_amount,
        raised: 0,
        donationTarget: payload.donation_target,
        registrations: 0,
        volunteers: 0,
        conversion: 0,
        location: payload.location,
        source: payload.source,
        banner: payload.banner_url,
        description: payload.description || "A Cre8Gre8 fundraising campaign.",
      };
      toast.success(`${payload.type} created locally. Add Supabase env vars to persist.`);
    }

    setCampaigns((current) => [created, ...current]);
    setSelectedCampaign(created);
    event.currentTarget.reset();
    setTab("overview");
  };

  const getLandingPageUrl = (campaign: Campaign) =>
    `${window.location.origin}/campaign/${campaign.id}`;

  const openLandingPage = (campaign: Campaign) => {
    window.open(getLandingPageUrl(campaign), "_blank");
  };

  const exportReport = () => {
    const rows = [
      ["Campaign", "Type", "Status", "Raised", "Goal", "Registrations", "Volunteers", "Source"],
      ...campaigns.map((campaign) => [
        campaign.name,
        campaign.type,
        campaign.status,
        campaign.raised,
        campaign.goal,
        campaign.registrations,
        campaign.volunteers,
        campaign.source,
      ]),
    ];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cre8gre8-fundraising-report.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Fundraising report exported.");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Fundraising Platform</h1>
          <p className="text-muted-foreground">Track campaign performance, launch new campaigns, and analyze fundraising results.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => loadCampaigns()} disabled={isLoading}>
            <Search className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setTab("create")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
            <Megaphone className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-sm text-yellow-900">
            Add Supabase env vars in <code>.env.local</code> and run <code>supabase.schema.sql</code>. Until then, actions update demo state only.
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setTab} className="space-y-6">
        <TabsList className="flex-wrap h-auto justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard title="Total Raised" value={formatCurrency(totals.raised)} detail={`${Math.round((totals.raised / Math.max(totals.goal, 1)) * 100)}% of portfolio goal`} icon={DollarSign} />
            <MetricCard title="Active Campaigns" value={campaigns.filter((campaign) => campaign.status === "Live").length.toString()} detail="Appeals, events, and pages" icon={Megaphone} />
            <MetricCard title="Monthly Giving" value="$18,420" detail="Projected recurring revenue" icon={Gift} />
            <MetricCard title="Volunteers" value={totals.volunteers.toLocaleString()} detail="Assigned supporters" icon={HandHeart} />
          </div>

          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[260px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search by campaign, type, or owner..." className="pl-10 bg-gray-50 border-0" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-gray-50 border-0"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[200px] bg-gray-50 border-0"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Annual Appeal">Annual Appeal</SelectItem>
                    <SelectItem value="Fundraising Event">Fundraising Event</SelectItem>
                    <SelectItem value="Crowdfunding">Crowdfunding</SelectItem>
                    <SelectItem value="Online Donation">Online Donation</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => toast.success("Filters applied to campaign portfolio.")}>
                  <Filter className="w-4 h-4 mr-2" />
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-4">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} selected={campaign.id === selectedCampaign.id} onSelect={() => setSelectedCampaign(campaign)} onLandingPage={() => openLandingPage(campaign)} />
              ))}
            </div>
            <SelectedCampaignPanel campaign={selectedCampaign} progress={selectedProgress} />
          </div>
        </TabsContent>

        <TabsContent value="create">
          <CampaignForm onSubmit={(event) => addCampaign(event)} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex justify-end">
            <Button variant="outline" onClick={exportReport}><Download className="w-4 h-4 mr-2" />Export Report</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <MetricCard title="Performance" value={`${selectedProgress}%`} detail="Selected campaign progress" icon={CheckCircle2} />
            <MetricCard title="Donations" value={formatCurrency(totals.raised)} detail="Portfolio raised" icon={DollarSign} />
            <MetricCard title="Registrations" value={totals.registrations.toLocaleString()} detail="Event signups" icon={Ticket} />
            <MetricCard title="Volunteers" value={totals.volunteers.toLocaleString()} detail="Confirmed helpers" icon={HandHeart} />
            <MetricCard title="Conversion" value={`${totals.conversion.toFixed(1)}%`} detail="Average rate" icon={TrendingUp} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ChartCard title="Donations">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trendData}>
                  <defs><linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} /><stop offset="95%" stopColor="#6C63FF" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Area dataKey="donations" stroke="#6C63FF" fill="url(#donationGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Registrations">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="registrations" fill="#4F8CFF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Conversion Rate">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line dataKey="conversion" stroke="#12B981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Donation Sources">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" outerRadius={86} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                    {sourceData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CampaignForm({ title = "Create Campaign", onSubmit }: { title?: string; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={onSubmit}>
      <Card className="border-border/50 shadow-sm">
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field id="campaignName" label="Campaign Name" placeholder="2026 Annual Impact Appeal" required />
            <SelectField id="campaignType" label="Type" defaultValue="Annual Appeal" items={["Annual Appeal", "Fundraising Event", "Crowdfunding", "Online Donation"]} />
            <SelectField id="campaignStatus" label="Status" defaultValue="Draft" items={["Draft", "Scheduled", "Live", "Completed"]} />
            <Field id="goalAmount" label="Target Amount" placeholder="$250,000" required />
            <Field id="eventDate" label="Start Date" type="date" />
            <Field id="endDate" label="End Date" type="date" />
            <Field id="deadline" label="Registration Deadline" type="date" />
            <Field id="donationTarget" label="Donor Target" placeholder="1,200" />
            <Field id="organizer" label="Organizer" placeholder="Development Team" />
            <Field id="location" label="Location" placeholder="Online or venue" />
            <Field id="banner" label="Banner URL" placeholder="https://..." />
            <SelectField id="source" label="Primary Source" defaultValue="Website" items={["Website", "Email", "Social", "Partners"]} />
          </div>
          <Textarea id="description" name="description" className="bg-input-background min-h-[120px]" placeholder="Campaign story, audience, and intended impact." />
          <Button className="bg-[#6C63FF] hover:bg-[#5A52D5]"><Megaphone className="w-4 h-4 mr-2" />Save</Button>
        </CardContent>
      </Card>
    </form>
  );
}

function CampaignCard({ campaign, selected, onSelect, onLandingPage }: { campaign: Campaign; selected: boolean; onSelect: () => void; onLandingPage?: () => void }) {
  const progress = Math.min(100, Math.round((campaign.raised / Math.max(campaign.goal, 1)) * 100));
  return (
    <Card className={`border-border/50 shadow-sm cursor-pointer transition-shadow hover:shadow-md ${selected ? "ring-2 ring-[#6C63FF]/30" : ""}`} onClick={onSelect}>
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row gap-5">
          <img src={campaign.banner} alt="" className="h-36 md:w-56 rounded-lg object-cover" />
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{campaign.name}</h3>
                  <Badge className={statusClass(campaign.status)}>{campaign.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{campaign.type} by {campaign.organizer}</p>
              </div>
              <div className="flex gap-2">
                {onLandingPage && (
                  <Button variant="outline" size="sm" onClick={(event) => { event.stopPropagation(); onLandingPage(); }}>
                    <Share2 className="w-4 h-4 mr-2" />Landing Page
                  </Button>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>{formatCurrency(campaign.raised)} raised</span>
                <span className="text-muted-foreground">{formatCurrency(campaign.goal)} goal</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <MiniStat label="Registrations" value={campaign.registrations.toLocaleString()} />
              <MiniStat label="Donor Target" value={campaign.donationTarget.toLocaleString()} />
              <MiniStat label="Volunteers" value={campaign.volunteers.toLocaleString()} />
              <MiniStat label="Conversion" value={`${campaign.conversion}%`} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SelectedCampaignPanel({ campaign, progress }: { campaign: Campaign; progress: number }) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader><CardTitle>Selected Fundraiser</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <img src={campaign.banner} alt="" className="h-44 w-full rounded-lg object-cover" />
        <div>
          <h3 className="font-semibold">{campaign.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
        </div>
        <Progress value={progress} />
        <InfoRow icon={Calendar} label="Start" value={campaign.eventDate || "TBD"} />
        <InfoRow icon={Calendar} label="End" value={campaign.endDate || campaign.deadline || "TBD"} />
        <InfoRow icon={MapPin} label="Location" value={campaign.location} />
        <InfoRow icon={Users} label="Organizer" value={campaign.organizer} />
      </CardContent>
    </Card>
  );
}

function MetricCard({ title, value, detail, icon: Icon }: { title: string; value: string; detail: string; icon: React.ElementType }) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground mt-2">{detail}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center"><Icon className="w-5 h-5 text-[#6C63FF]" /></div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-muted-foreground">{label}</p><p className="font-medium">{value}</p></div>;
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2 text-muted-foreground"><Icon className="w-4 h-4" />{label}</span><span className="font-medium text-right">{value}</span></div>;
}

function Field({ id, label, placeholder, type = "text", required }: { id: string; label: string; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required ? " *" : ""}</Label>
      <Input id={id} name={id} type={type} placeholder={placeholder} required={required} className="bg-input-background" />
    </div>
  );
}

function SelectField({ id, label, defaultValue, items }: { id: string; label: string; defaultValue: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select name={id} defaultValue={defaultValue}>
        <SelectTrigger id={id} className="bg-input-background"><SelectValue /></SelectTrigger>
        <SelectContent>{items.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card className="border-border/50 shadow-sm"><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{children}</CardContent></Card>;
}
