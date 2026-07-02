import { useEffect, useState } from "react";
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
import { Calendar, CheckCircle2, Clock, Gift, Megaphone, PauseCircle, PlayCircle, TrendingUp } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type CampaignStatus = "Live" | "Draft" | "Scheduled" | "Completed";

type AppealCampaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  goal: number;
  raised: number;
};

type DbCampaign = {
  id: string;
  name: string;
  type: string;
  status: CampaignStatus;
  goal_amount: number;
  amount_raised: number;
};

const fallbackAppeals: AppealCampaign[] = [
  { id: "demo-annual-appeal", name: "2026 Annual Impact Appeal", status: "Live", goal: 500000, raised: 214800 },
];

const monthlyDonors = [
  { name: "Sarah Johnson", amount: 75, status: "Active", nextCharge: "2026-07-01", reminders: "On" },
  { name: "Michael Chen", amount: 250, status: "Paused", nextCharge: "Paused", reminders: "On" },
  { name: "Priya Shah", amount: 125, status: "Active", nextCharge: "2026-07-05", reminders: "Off" },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const toNumber = (value: FormDataEntryValue | null) => Number(String(value || "0").replace(/[^0-9.]/g, "")) || 0;
const toText = (value: FormDataEntryValue | null) => String(value || "").trim();

export function DonationsManagement() {
  const tenantId = useTenantId();
  const [appeals, setAppeals] = useState<AppealCampaign[]>(fallbackAppeals);

  useEffect(() => {
    void loadAppeals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const loadAppeals = async () => {
    if (!supabase || !tenantId) return;
    const { data, error } = await supabase
      .from("campaigns")
      .select("id, name, type, status, goal_amount, amount_raised")
      .eq("type", "Annual Appeal")
      .order("created_at", { ascending: false });

    if (error) {
      if (!error.message.includes("schema cache") && !error.message.includes("Could not find table")) {
        toast.error(`Could not load annual appeals: ${error.message}`);
      }
      return;
    }

    const mapped = (data || []).map((campaign: DbCampaign) => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      goal: Number(campaign.goal_amount || 0),
      raised: Number(campaign.amount_raised || 0),
    }));
    if (mapped.length) setAppeals(mapped);
  };

  const addAppeal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      tenant_id: tenantId,
      name: toText(form.get("campaignName")),
      type: "Annual Appeal",
      status: toText(form.get("campaignStatus")) || "Draft",
      goal_amount: toNumber(form.get("goalAmount")),
      description: toText(form.get("description")),
      amount_raised: 0,
    };

    if (!payload.name || !payload.goal_amount) {
      toast.error("Appeal name and target amount are required.");
      return;
    }

    if (supabase) {
      const { data, error } = await supabase.from("campaigns").insert(payload).select("id, name, status, goal_amount, amount_raised").single();
      if (error) {
        toast.error(`Annual appeal was not saved: ${error.message}`);
        return;
      }
      setAppeals((current) => [
        { id: data.id, name: data.name, status: data.status, goal: Number(data.goal_amount || 0), raised: Number(data.amount_raised || 0) },
        ...current,
      ]);
      toast.success("Annual appeal saved to Supabase.");
    } else {
      setAppeals((current) => [
        { id: crypto.randomUUID(), name: payload.name, status: payload.status as CampaignStatus, goal: payload.goal_amount, raised: 0 },
        ...current,
      ]);
      toast.success("Annual appeal created locally. Add Supabase env vars to persist.");
    }
    event.currentTarget.reset();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Donations</h1>
        <p className="text-muted-foreground">Manage annual appeals and monthly giving programs.</p>
      </div>

      {!isSupabaseConfigured && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-sm text-yellow-900">
            Add Supabase env vars in <code>.env.local</code> and run <code>supabase.schema.sql</code>. Until then, actions update demo state only.
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="annual" className="space-y-6">
        <TabsList className="flex-wrap h-auto justify-start">
          <TabsTrigger value="annual">Annual Donation</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Donation</TabsTrigger>
        </TabsList>

        <TabsContent value="annual" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <form onSubmit={addAppeal}>
              <Card className="border-border/50 shadow-sm">
                <CardHeader><CardTitle>Create Annual Appeal</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field id="campaignName" label="Campaign Name" placeholder="2026 Annual Impact Appeal" required />
                    <SelectField id="campaignStatus" label="Status" defaultValue="Draft" items={["Draft", "Scheduled", "Live", "Completed"]} />
                    <Field id="goalAmount" label="Target Amount" placeholder="$250,000" required />
                  </div>
                  <Textarea id="description" name="description" className="bg-input-background min-h-[120px]" placeholder="Appeal story, audience, and intended impact." />
                  <Button className="bg-[#6C63FF] hover:bg-[#5A52D5]"><Megaphone className="w-4 h-4 mr-2" />Save</Button>
                </CardContent>
              </Card>
            </form>
            <ModuleCard title="Email Campaign Integration">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <ActionTile icon={Calendar} title="Segment" text="Lapsed, active, major, first-time donors" onClick={() => toast.success("Donor segments synced to email campaign.")} />
                <ActionTile icon={Calendar} title="Schedule" text="Start/end windows and timezone sending" onClick={() => toast.success("Appeal schedule saved.")} />
                <ActionTile icon={TrendingUp} title="Track" text="Open rate, click rate, revenue attribution" onClick={() => toast.success("Appeal tracking dashboard opened.")} />
              </div>
            </ModuleCard>
          </div>
          <ModuleCard title="Annual Appeal Pipeline">
            {appeals.map((appeal) => (
              <ProgressRow key={appeal.id} label={appeal.name} value={appeal.raised} goal={appeal.goal} />
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
      </Tabs>
    </div>
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

function ActionTile({ icon: Icon, title, text, onClick }: { icon: React.ElementType; title: string; text: string; onClick: () => void }) {
  return <button onClick={onClick} className="text-left rounded-lg border p-4 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5"><Icon className="w-5 h-5 text-[#6C63FF] mb-3" /><p className="font-medium">{title}</p><p className="text-sm text-muted-foreground">{text}</p></button>;
}

function ProgressRow({ label, value, goal }: { label: string; value: number; goal: number }) {
  const progress = Math.min(100, Math.round((value / Math.max(goal, 1)) * 100));
  return <div className="mb-4"><div className="flex justify-between text-sm mb-2"><span className="font-medium">{label}</span><span>{formatCurrency(value)} / {formatCurrency(goal)}</span></div><Progress value={progress} /></div>;
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
