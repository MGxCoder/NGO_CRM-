import { useEffect, useMemo, useState } from "react";
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
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Gift,
  HandHeart,
  Image,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  PauseCircle,
  PlayCircle,
  Plus,
  QrCode,
  Receipt,
  Search,
  Send,
  Share2,
  Sparkles,
  Ticket,
  Timer,
  TrendingUp,
  UserCheck,
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

const monthlyDonors = [
  { name: "Sarah Johnson", amount: 75, status: "Active", nextCharge: "2026-07-01", reminders: "On" },
  { name: "Michael Chen", amount: 250, status: "Paused", nextCharge: "Paused", reminders: "On" },
  { name: "Priya Shah", amount: 125, status: "Active", nextCharge: "2026-07-05", reminders: "Off" },
];

const majorGiftDonors = [
  { name: "Avery Foundation", value: "$125,000", stage: "Proposal", nextStep: "Board lunch", lastGift: "$75,000" },
  { name: "Daniel Brooks", value: "$50,000", stage: "Cultivation", nextStep: "Site visit", lastGift: "$20,000" },
  { name: "Northstar Trust", value: "$250,000", stage: "Stewardship", nextStep: "Impact report", lastGift: "$250,000" },
];

const volunteerRoster = [
  { name: "Lena Ortiz", skills: "Check-in, Photography", availability: "Weekends", event: "Run for Rural Classrooms", hours: 18 },
  { name: "Noah Patel", skills: "Logistics, Driving", availability: "Evenings", event: "Clean Water Crowdfund", hours: 24 },
  { name: "Grace Kim", skills: "Fundraising, Calls", availability: "Remote", event: "Annual Impact Appeal", hours: 31 },
];

const eventAgenda = [
  { time: "08:00", title: "Check-in opens", speaker: "Volunteer Team" },
  { time: "09:15", title: "Opening remarks", speaker: "Maya Lewis" },
  { time: "10:00", title: "Community run begins", speaker: "Event Crew" },
  { time: "12:30", title: "Live donation match", speaker: "Sponsor Panel" },
];

const comments = [
  { name: "Emma", text: "Shared with my workplace giving circle." },
  { name: "David", text: "Proud to support clean water access." },
];

const chartMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const galleryImages = [
  "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80",
];

const tenants = [
  { id: "default", name: "Cre8Gre8 Global" },
  { id: "north-region", name: "Cre8Gre8 North Region" },
  { id: "south-region", name: "Cre8Gre8 South Region" },
];

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
  const initialTenant = localStorage.getItem("cre8gre8:tenant-id") || "default";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tenantId, setTenantId] = useState(initialTenant);
  const [campaigns, setCampaigns] = useState<Campaign[]>(fallbackCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>(fallbackCampaigns[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("Ready for ticket sales and confirmations.");
  const [donationStatus, setDonationStatus] = useState("Gateway ready for one-time or recurring gifts.");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [emailCopy, setEmailCopy] = useState("Dear supporter,\n\nYour generosity creates measurable impact. Here is what your support made possible this month...");

  useEffect(() => {
    localStorage.setItem("cre8gre8:tenant-id", tenantId);
    void loadCampaigns(tenantId);
  }, [tenantId]);

  const loadCampaigns = async (activeTenant = tenantId) => {
    if (!supabase) {
      toast.info("Supabase is not configured. Using demo fundraising data.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("tenant_id", activeTenant)
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
            const [registrations, donations, volunteers] = await Promise.all([
              supabase.from("campaign_registrations").select("id", { count: "exact", head: true }).eq("tenant_id", activeTenant).eq("campaign_id", campaign.id),
              supabase.from("campaign_donations").select("id", { count: "exact", head: true }).eq("tenant_id", activeTenant).eq("campaign_id", campaign.id),
              supabase.from("campaign_volunteers").select("id", { count: "exact", head: true }).eq("tenant_id", activeTenant).eq("campaign_id", campaign.id),
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

  const addCampaign = async (event: React.FormEvent<HTMLFormElement>, forcedType?: string) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      tenant_id: tenantId,
      name: toText(form.get("campaignName")),
      type: forcedType || toText(form.get("campaignType")) || "Fundraising Event",
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
    setTab(forcedType === "Fundraising Event" ? "events" : "crowdfunding");
  };

  const saveRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const tickets = Math.max(1, Math.round(toNumber(form.get("tickets")) || 1));
    const payload = {
      tenant_id: tenantId,
      campaign_id: selectedCampaign.id,
      name: toText(form.get("registrationName")),
      email: toText(form.get("registrationEmail")),
      phone: toText(form.get("registrationPhone")),
      tickets,
      notes: toText(form.get("registrationNotes")),
      confirmation_sent: true,
    };
    if (!payload.name || !payload.email) {
      toast.error("Name and email are required.");
      return;
    }
    if (supabase) {
      const { error } = await supabase.from("campaign_registrations").insert(payload);
      if (error) {
        toast.error(`Registration failed: ${error.message}`);
        return;
      }
    }
    updateCampaign({ registrations: selectedCampaign.registrations + tickets });
    setRegistrationStatus(`Registered ${payload.name}. Confirmation email queued and ${tickets} ticket(s) issued.`);
    event.currentTarget.reset();
    toast.success("Event registration saved.");
  };

  const saveDonation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = toNumber(form.get("amount"));
    const receipt = `CRE8-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      tenant_id: tenantId,
      campaign_id: selectedCampaign.id,
      donor_name: toText(form.get("donorName")),
      donor_email: toText(form.get("donorEmail")),
      amount,
      payment_status: "paid",
      receipt_number: receipt,
      source: toText(form.get("paymentGateway")) || "Stripe",
      donation_type: toText(form.get("donationType")) || "One-time",
    };

    if (!payload.donor_name || !payload.donor_email || !amount) {
      toast.error("Donor name, email, and amount are required.");
      return;
    }
    if (supabase) {
      const { error } = await supabase.from("campaign_donations").insert(payload);
      if (error) {
        toast.error(`Donation failed: ${error.message}`);
        return;
      }
      await supabase
        .from("campaigns")
        .update({ amount_raised: selectedCampaign.raised + amount })
        .eq("tenant_id", tenantId)
        .eq("id", selectedCampaign.id);
    }
    updateCampaign({ raised: selectedCampaign.raised + amount });
    setReceiptNumber(receipt);
    setDonationStatus(`${payload.donation_type} donation processed through ${payload.source}. Tax receipt ${receipt} generated.`);
    event.currentTarget.reset();
    toast.success("Donation saved and receipt generated.");
  };

  const saveVolunteer = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const form = event ? new FormData(event.currentTarget) : null;
    const payload = {
      tenant_id: tenantId,
      campaign_id: selectedCampaign.id,
      name: toText(form?.get("volunteerName") || "Website volunteer"),
      email: toText(form?.get("volunteerEmail") || "volunteer@cre8gre8.org"),
      phone: toText(form?.get("volunteerPhone") || ""),
      notes: `Skills: ${toText(form?.get("skills") || "General")} | Availability: ${toText(form?.get("availability") || "Flexible")}`,
    };
    if (supabase) {
      const { error } = await supabase.from("campaign_volunteers").insert(payload);
      if (error) {
        toast.error(`Volunteer signup failed: ${error.message}`);
        return;
      }
    }
    updateCampaign({ volunteers: selectedCampaign.volunteers + 1 });
    event?.currentTarget.reset();
    toast.success("Volunteer signup saved and assigned to event.");
  };

  const updateCampaign = (patch: Partial<Campaign>) => {
    setSelectedCampaign((current) => {
      const updated = { ...current, ...patch };
      setCampaigns((items) => items.map((campaign) => (campaign.id === updated.id ? updated : campaign)));
      return updated;
    });
  };

  const shareCampaign = async () => {
    const text = `${selectedCampaign.name}: ${selectedCampaign.description}`;
    if (navigator.share) {
      await navigator.share({ title: selectedCampaign.name, text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      toast.success("Campaign link copied.");
    }
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

  const generateEmail = () => {
    setEmailCopy(
      `Subject: ${selectedCampaign.name} needs your leadership\n\nDear supporter,\n\nWe are ${selectedProgress}% toward our ${formatCurrency(selectedCampaign.goal)} goal. Your gift today helps Cre8Gre8 move from campaign promise to measurable impact.\n\nWith gratitude,\nThe Cre8Gre8 Team`,
    );
    toast.success("AI email draft generated in Direct Mail.");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Fundraising Platform</h1>
          <p className="text-muted-foreground">Annual appeals, monthly giving, crowdfunding, events, major gifts, volunteers, and direct mail.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={tenantId} onValueChange={setTenantId}>
            <SelectTrigger className="w-[230px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => loadCampaigns()} disabled={isLoading}>
            <Search className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setTab("create")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-sm text-yellow-900">
            Add Supabase values in `.env.local`, then run `supabase.schema.sql`. Until then, actions update demo state locally.
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Tenant scope: <span className="font-medium text-foreground">{tenants.find((tenant) => tenant.id === tenantId)?.name}</span>. Campaigns, donations, registrations, volunteers, direct mail, and gift records are filtered by `tenant_id`.
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setTab} className="space-y-6">
        <TabsList className="flex-wrap h-auto justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="appeals">Annual Appeals</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Giving</TabsTrigger>
          <TabsTrigger value="crowdfunding">Crowdfunding</TabsTrigger>
          <TabsTrigger value="donations">Online Donations</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="major-gifts">Major Gifts</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="direct-mail">Direct Mail</TabsTrigger>
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
                <CampaignCard key={campaign.id} campaign={campaign} selected={campaign.id === selectedCampaign.id} onSelect={() => setSelectedCampaign(campaign)} onPreview={() => setTab(campaign.type === "Fundraising Event" ? "events" : "crowdfunding")} />
              ))}
            </div>
            <SelectedCampaignPanel campaign={selectedCampaign} progress={selectedProgress} />
          </div>
        </TabsContent>

        <TabsContent value="create">
          <CampaignForm onSubmit={(event) => addCampaign(event)} />
        </TabsContent>

        <TabsContent value="appeals" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <CampaignForm title="Create Annual Appeal" forcedType="Annual Appeal" onSubmit={(event) => addCampaign(event, "Annual Appeal")} />
            <ModuleCard title="Email Campaign Integration">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <ActionTile icon={Mail} title="Segment" text="Lapsed, active, major, first-time donors" onClick={() => toast.success("Donor segments synced to email campaign.")} />
                <ActionTile icon={Calendar} title="Schedule" text="Start/end windows and timezone sending" onClick={() => toast.success("Appeal schedule saved.")} />
                <ActionTile icon={TrendingUp} title="Track" text="Open rate, click rate, revenue attribution" onClick={() => setTab("analytics")} />
              </div>
            </ModuleCard>
          </div>
          <ModuleCard title="Annual Appeal Pipeline">
            {campaigns.filter((campaign) => campaign.type === "Annual Appeal").map((campaign) => (
              <ProgressRow key={campaign.id} label={campaign.name} value={campaign.raised} goal={campaign.goal} />
            ))}
          </ModuleCard>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard title="Recurring Revenue" value="$18,420" detail="Monthly projected" icon={Gift} />
            <MetricCard title="Active Plans" value="286" detail="Donor subscriptions" icon={CheckCircle2} />
            <MetricCard title="Paused Plans" value="14" detail="Resume campaigns ready" icon={PauseCircle} />
            <MetricCard title="Auto Reminders" value="96%" detail="Payment reminders enabled" icon={Clock} />
          </div>
          <Card className="border-border/50 shadow-sm">
            <CardHeader><CardTitle>Donor Subscription Dashboard</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {monthlyDonors.map((donor) => (
                <div key={donor.name} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center rounded-lg border p-4">
                  <div className="font-medium">{donor.name}</div>
                  <div>{formatCurrency(donor.amount)}/mo</div>
                  <Badge className={donor.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>{donor.status}</Badge>
                  <div className="text-sm text-muted-foreground">{donor.nextCharge}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.success(`${donor.name} subscription ${donor.status === "Active" ? "paused" : "resumed"}.`)}>
                      {donor.status === "Active" ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Reminder preference updated.")}>Reminder</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crowdfunding" className="space-y-6">
          <PublicPagePreview campaign={selectedCampaign} progress={selectedProgress} onDonate={() => setTab("donations")} onShare={shareCampaign} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModuleCard title="Comments">
              {comments.map((comment) => (
                <div key={comment.name} className="rounded-lg border p-3 mb-3">
                  <p className="font-medium">{comment.name}</p>
                  <p className="text-sm text-muted-foreground">{comment.text}</p>
                </div>
              ))}
              <Button variant="outline" onClick={() => toast.success("Comment added to campaign page.")}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
            </ModuleCard>
            <ModuleCard title="Updates">
              <Textarea placeholder="Post a campaign update for supporters..." className="bg-input-background min-h-[120px]" />
              <Button className="mt-3 bg-[#6C63FF] hover:bg-[#5A52D5]" onClick={() => toast.success("Crowdfunding update published.")}>Publish Update</Button>
            </ModuleCard>
          </div>
        </TabsContent>

        <TabsContent value="donations">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={saveDonation} className="lg:col-span-2">
              <Card className="border-border/50 shadow-sm">
                <CardHeader><CardTitle>Online Donations</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field id="donorName" label="Donor Name" placeholder="Priya Shah" required />
                    <Field id="donorEmail" label="Email" type="email" placeholder="priya@email.com" required />
                    <Field id="amount" label="Amount" placeholder="$250" required />
                    <SelectField id="donationType" label="Donation Type" defaultValue="One-time" items={["One-time", "Recurring monthly", "Recurring quarterly"]} />
                    <SelectField id="paymentGateway" label="Payment Gateway" defaultValue="Stripe" items={["Stripe", "PayPal", "Razorpay", "Offline pledge"]} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {["Payment", "Success Page", "Save Donor", "Tax Receipt"].map((step, index) => <StepCard key={step} step={step} index={index} />)}
                  </div>
                  <Button className="bg-[#6C63FF] hover:bg-[#5A52D5]"><CreditCard className="w-4 h-4 mr-2" />Process Donation</Button>
                </CardContent>
              </Card>
            </form>
            <StatusCard icon={Receipt} title={receiptNumber ? "Receipt Generated" : "Donation Status"} text={donationStatus} />
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <CampaignForm title="Create Event" forcedType="Fundraising Event" onSubmit={(event) => addCampaign(event, "Fundraising Event")} />
              <EventLanding campaign={selectedCampaign} progress={selectedProgress} onRegister={() => setTab("events")} onDonate={() => setTab("donations")} onVolunteer={() => void saveVolunteer()} />
              <form onSubmit={saveRegistration}>
                <ModuleCard title="Event Registration & Ticket Management">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field id="registrationName" label="Name" placeholder="Alex Morgan" required />
                    <Field id="registrationEmail" label="Email" type="email" placeholder="alex@email.com" required />
                    <Field id="registrationPhone" label="Phone" placeholder="+1 (555) 123-4567" />
                    <Field id="tickets" label="Tickets" type="number" placeholder="2" />
                  </div>
                  <Textarea id="registrationNotes" name="registrationNotes" className="bg-input-background mt-4" placeholder="Dietary, accessibility, or seating notes." />
                  <Button className="mt-4 bg-[#6C63FF] hover:bg-[#5A52D5]"><Ticket className="w-4 h-4 mr-2" />Issue Tickets</Button>
                </ModuleCard>
              </form>
            </div>
            <div className="space-y-6">
              <StatusCard icon={Ticket} title="Registration Status" text={registrationStatus} />
              <ModuleCard title="QR Code Check-in">
                <div className="aspect-square rounded-lg border bg-gray-50 flex items-center justify-center">
                  <QrCode className="w-28 h-28 text-[#6C63FF]" />
                </div>
                <Button className="w-full mt-3" variant="outline" onClick={() => toast.success("QR check-in scanned and attendee marked present.")}>Scan Check-in</Button>
              </ModuleCard>
              <ModuleCard title="Live Donation Tracker">
                <p className="text-3xl font-semibold">{formatCurrency(selectedCampaign.raised)}</p>
                <Progress value={selectedProgress} className="my-3" />
                <Button className="w-full bg-[#6C63FF] hover:bg-[#5A52D5]" onClick={() => setTab("donations")}>Donation During Event</Button>
              </ModuleCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="major-gifts" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            {majorGiftDonors.map((donor) => (
              <Card key={donor.name} className="border-border/50 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{donor.name}</h3>
                      <p className="text-sm text-muted-foreground">Profile, timeline, meetings, follow-ups, and donation history</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{donor.stage}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <MiniStat label="Capacity" value={donor.value} />
                    <MiniStat label="Last Gift" value={donor.lastGift} />
                    <MiniStat label="Next Follow-up" value={donor.nextStep} />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => toast.success("Meeting logged to relationship timeline.")}>Log Meeting</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Follow-up task created.")}>Add Follow-up</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ModuleCard title="Relationship Timeline">
            {["Intro call", "Program briefing", "Proposal sent", "Board lunch scheduled"].map((item) => (
              <div key={item} className="border-l-2 border-[#6C63FF] pl-3 pb-4 text-sm">{item}</div>
            ))}
          </ModuleCard>
        </TabsContent>

        <TabsContent value="volunteers" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <form onSubmit={saveVolunteer}>
            <ModuleCard title="Volunteer Registration">
              <Field id="volunteerName" label="Name" placeholder="Lena Ortiz" required />
              <Field id="volunteerEmail" label="Email" type="email" placeholder="lena@email.com" required />
              <Field id="volunteerPhone" label="Phone" placeholder="+1 (555) 123-4567" />
              <Field id="skills" label="Skills" placeholder="Check-in, photography, logistics" />
              <Field id="availability" label="Availability" placeholder="Weekends, evenings, remote" />
              <Button className="mt-4 bg-[#6C63FF] hover:bg-[#5A52D5]"><HandHeart className="w-4 h-4 mr-2" />Assign Volunteer</Button>
            </ModuleCard>
          </form>
          <Card className="xl:col-span-2 border-border/50 shadow-sm">
            <CardHeader><CardTitle>Volunteer Hours & Assignments</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {volunteerRoster.map((volunteer) => (
                <div key={volunteer.name} className="grid grid-cols-1 md:grid-cols-5 gap-3 rounded-lg border p-4 text-sm">
                  <span className="font-medium">{volunteer.name}</span>
                  <span>{volunteer.skills}</span>
                  <span>{volunteer.availability}</span>
                  <span>{volunteer.event}</span>
                  <span className="font-medium">{volunteer.hours} hrs</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="direct-mail" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <ModuleCard title="Templates & Segmentation">
            <SelectField id="template" label="Template" defaultValue="Monthly Impact" items={["Monthly Impact", "Annual Appeal", "Event Invite", "Major Gift Follow-up"]} />
            <SelectField id="segment" label="Donor Segment" defaultValue="All Active Donors" items={["All Active Donors", "Lapsed Donors", "Major Donors", "Monthly Donors"]} />
            <Field id="schedule" label="Schedule" type="datetime-local" />
            <Button className="mt-4 bg-[#6C63FF] hover:bg-[#5A52D5]" onClick={() => toast.success("Email campaign scheduled.")}><Send className="w-4 h-4 mr-2" />Schedule Campaign</Button>
          </ModuleCard>
          <Card className="xl:col-span-2 border-border/50 shadow-sm">
            <CardHeader><CardTitle>Email Writing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea value={emailCopy} onChange={(event) => setEmailCopy(event.target.value)} className="min-h-[260px] bg-input-background" />
              <div className="flex flex-wrap gap-3">
                <Button onClick={generateEmail} className="bg-[#6C63FF] hover:bg-[#5A52D5]"><Sparkles className="w-4 h-4 mr-2" />Write Email</Button>
                <Button variant="outline" onClick={() => toast.success("Preview opened for email campaign.")}><Eye className="w-4 h-4 mr-2" />Preview</Button>
                <Button variant="outline" onClick={() => toast.success("Test email sent.")}><Mail className="w-4 h-4 mr-2" />Send Test</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard title="Open Rate" value="42.8%" detail="Last 30 days" icon={Mail} />
                <MetricCard title="Click Rate" value="11.6%" detail="Last 30 days" icon={UserCheck} />
                <MetricCard title="Revenue" value="$38,240" detail="Attributed gifts" icon={DollarSign} />
              </div>
            </CardContent>
          </Card>
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

function CampaignForm({ title = "Create Campaign", forcedType, onSubmit }: { title?: string; forcedType?: string; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={onSubmit}>
      <Card className="border-border/50 shadow-sm">
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field id="campaignName" label={forcedType === "Fundraising Event" ? "Event Name" : "Campaign Name"} placeholder={forcedType || "2026 Annual Impact Appeal"} required />
            {forcedType ? <input type="hidden" name="campaignType" value={forcedType} /> : <SelectField id="campaignType" label="Type" defaultValue="Annual Appeal" items={["Annual Appeal", "Fundraising Event", "Crowdfunding", "Online Donation"]} />}
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

function CampaignCard({ campaign, selected, onSelect, onPreview }: { campaign: Campaign; selected: boolean; onSelect: () => void; onPreview: () => void }) {
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
              <Button variant="outline" size="sm" onClick={(event) => { event.stopPropagation(); onPreview(); }}><Eye className="w-4 h-4 mr-2" />Open</Button>
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

function PublicPagePreview({ campaign, progress, onDonate, onShare }: { campaign: Campaign; progress: number; onDonate: () => void; onShare: () => void }) {
  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <div className="min-h-[360px] bg-cover bg-center flex items-end" style={{ backgroundImage: `linear-gradient(180deg, rgba(17,24,39,0.15), rgba(17,24,39,0.78)), url(${campaign.banner})` }}>
        <div className="p-8 text-white max-w-3xl">
          <Badge className="bg-white/20 text-white mb-4">{campaign.type}</Badge>
          <h2 className="text-4xl font-semibold mb-3">{campaign.name}</h2>
          <p className="text-white/85 mb-5">{campaign.description}</p>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-[#6C63FF] hover:bg-[#5A52D5]" onClick={onDonate}>Donate Now</Button>
            <Button variant="outline" className="border-white/50 text-white hover:bg-white/10" onClick={onShare}><Share2 className="w-4 h-4 mr-2" />Share</Button>
          </div>
        </div>
      </div>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionTitle icon={FileText} title="Campaign Story" />
            <p className="text-muted-foreground mt-3">{campaign.description}</p>
          </div>
          <div className="rounded-lg border p-4">
            <SectionTitle icon={DollarSign} title="Goal Progress" />
            <p className="text-2xl font-semibold mt-3">{formatCurrency(campaign.raised)}</p>
            <p className="text-sm text-muted-foreground mb-3">raised of {formatCurrency(campaign.goal)}</p>
            <Progress value={progress} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryImages.map((image) => <img key={image} src={image} alt="" className="h-44 w-full rounded-lg object-cover" />)}
        </div>
      </CardContent>
    </Card>
  );
}

function EventLanding({ campaign, progress, onRegister, onDonate, onVolunteer }: { campaign: Campaign; progress: number; onRegister: () => void; onDonate: () => void; onVolunteer: () => void }) {
  return (
    <ModuleCard title="Event Landing Page">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <img src={campaign.banner} alt="" className="h-64 w-full rounded-lg object-cover" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LandingPanel icon={Timer} title="Countdown Timer" text="53 days 04 hours" />
            <LandingPanel icon={Image} title="Sponsor Section" text="Northstar Health, Blue River Foods" />
            <LandingPanel icon={PlayCircle} title="Gallery" text="Photos and video highlights" />
          </div>
          <ModuleCard title="Agenda & Speakers">
            {eventAgenda.map((item) => (
              <div key={item.time} className="grid grid-cols-3 gap-3 rounded-lg border p-3 mb-2 text-sm">
                <span className="font-medium">{item.time}</span>
                <span>{item.title}</span>
                <span className="text-muted-foreground">{item.speaker}</span>
              </div>
            ))}
          </ModuleCard>
        </div>
        <div className="space-y-4">
          <ProgressRow label="Live donations" value={campaign.raised} goal={campaign.goal} />
          <Button className="w-full bg-[#6C63FF] hover:bg-[#5A52D5]" onClick={onRegister}>Register for Event</Button>
          <Button className="w-full" variant="outline" onClick={onDonate}>Donate During Event</Button>
          <Button className="w-full" variant="outline" onClick={onVolunteer}>Volunteer Signup</Button>
        </div>
      </div>
    </ModuleCard>
  );
}

function ModuleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
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

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return <div className="flex items-center gap-2"><Icon className="w-5 h-5 text-[#6C63FF]" /><h3 className="font-semibold">{title}</h3></div>;
}

function LandingPanel({ icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return <div className="rounded-lg border p-4"><SectionTitle icon={icon} title={title} /><p className="text-sm text-muted-foreground mt-3">{text}</p></div>;
}

function ActionTile({ icon: Icon, title, text, onClick }: { icon: React.ElementType; title: string; text: string; onClick: () => void }) {
  return <button onClick={onClick} className="text-left rounded-lg border p-4 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5"><Icon className="w-5 h-5 text-[#6C63FF] mb-3" /><p className="font-medium">{title}</p><p className="text-sm text-muted-foreground">{text}</p></button>;
}

function ProgressRow({ label, value, goal }: { label: string; value: number; goal: number }) {
  const progress = Math.min(100, Math.round((value / Math.max(goal, 1)) * 100));
  return <div className="mb-4"><div className="flex justify-between text-sm mb-2"><span className="font-medium">{label}</span><span>{formatCurrency(value)} / {formatCurrency(goal)}</span></div><Progress value={progress} /></div>;
}

function StepCard({ step, index }: { step: string; index: number }) {
  return <div className="rounded-lg border p-4 text-sm"><div className="w-8 h-8 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center mb-3">{index + 1}</div><p className="font-medium">{step}</p></div>;
}

function StatusCard({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return <Card className="border-border/50 shadow-sm"><CardContent className="p-6"><div className="w-12 h-12 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-[#6C63FF]" /></div><h3 className="font-semibold mb-2">{title}</h3><p className="text-sm text-muted-foreground">{text}</p></CardContent></Card>;
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card className="border-border/50 shadow-sm"><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{children}</CardContent></Card>;
}
