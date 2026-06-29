import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import {
  Share2,
  Heart,
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Copy,
  Facebook,
  Twitter,
  Mail,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  banner_url: string | null;
  goal_amount: number;
  amount_raised: number;
  donation_target: number;
  status: string;
  organizer: string | null;
  event_date: string | null;
  end_date: string | null;
  location: string | null;
  type: string;
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const daysLeft = (endDate: string | null) => {
  if (!endDate) return null;
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000);
  return diff > 0 ? diff : 0;
};

export function CampaignLandingPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [donorCount, setDonorCount] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (id) fetchCampaign(id);
  }, [id]);

  const fetchCampaign = async (campaignId: string) => {
    if (!isSupabaseConfigured || !supabase) { setLoading(false); return; }
    const [{ data }, { count }] = await Promise.all([
      supabase.from("campaigns").select("*").eq("id", campaignId).single(),
      supabase.from("campaign_donations").select("id", { count: "exact", head: true }).eq("campaign_id", campaignId),
    ]);
    if (data) setCampaign(data);
    setDonorCount(count ?? 0);
    setLoading(false);
  };

  const pageUrl = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () =>
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Support "${campaign?.name}" – ${pageUrl}`)}`);
  const shareFacebook = () =>
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`);
  const shareEmail = () =>
    window.open(`mailto:?subject=${encodeURIComponent(campaign?.name ?? "")}&body=${encodeURIComponent(`Check out this campaign: ${pageUrl}`)}`);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Heart className="w-16 h-16 text-[#6C63FF]/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
          <p className="text-muted-foreground">This campaign may have ended or doesn't exist.</p>
        </div>
      </div>
    );
  }

  const progress = Math.min(100, Math.round((campaign.amount_raised / Math.max(campaign.goal_amount, 1)) * 100));
  const remaining = daysLeft(campaign.end_date);
  const pct = progress;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Nav bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#4F8CFF] flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-semibold text-lg bg-gradient-to-r from-[#6C63FF] to-[#4F8CFF] bg-clip-text text-transparent">
            Cre8Gre8
          </span>
        </div>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareMenu(!showShareMenu)}
          >
            <Share2 className="w-4 h-4 mr-2" /> Share Campaign
          </Button>
          {showShareMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-30 p-2 space-y-1">
              <button
                onClick={() => { copyLink(); setShowShareMenu(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Copy className="w-4 h-4 text-gray-500" />
                {copied ? "Copied!" : "Copy link"}
              </button>
              <button
                onClick={() => { shareTwitter(); setShowShareMenu(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Twitter className="w-4 h-4 text-sky-500" /> Share on X/Twitter
              </button>
              <button
                onClick={() => { shareFacebook(); setShowShareMenu(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Facebook className="w-4 h-4 text-blue-600" /> Share on Facebook
              </button>
              <button
                onClick={() => { shareEmail(); setShowShareMenu(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Mail className="w-4 h-4 text-gray-500" /> Share via Email
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-[420px] md:h-[520px] overflow-hidden">
        {campaign.banner_url ? (
          <img
            src={campaign.banner_url}
            alt={campaign.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#6C63FF] to-[#4F8CFF]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
          <div className="max-w-3xl">
            <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              {campaign.type}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">{campaign.name}</h1>
            {campaign.organizer && (
              <p className="text-white/80 text-sm">By {campaign.organizer}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left – description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {campaign.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {campaign.location}
              </div>
            )}
            {campaign.event_date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(campaign.event_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </div>
            )}
            {remaining !== null && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {remaining > 0 ? `${remaining} days left` : "Campaign ended"}
              </div>
            )}
          </div>

          {/* Description */}
          {campaign.description && (
            <div>
              <h2 className="text-xl font-semibold mb-3">About this Campaign</h2>
              <p className="text-base leading-relaxed text-foreground whitespace-pre-line">
                {campaign.description}
              </p>
            </div>
          )}

          {/* What your donation does */}
          <div className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#6C63FF]" /> Your Donation Makes a Difference
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Every $25", impact: "Provides school supplies for 1 child" },
                { label: "Every $100", impact: "Funds a month of clean water access" },
                { label: "Every $500", impact: "Supports a family for a full year" },
              ].map((item, i) => (
                <div key={i} className="bg-[#6C63FF]/5 rounded-xl p-4 text-center">
                  <p className="font-semibold text-[#6C63FF] text-sm mb-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right – donation card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-border/50 rounded-2xl shadow-lg p-6 sticky top-24 space-y-5">
            {/* Raised */}
            <div>
              <div className="flex items-end justify-between mb-1">
                <span className="text-3xl font-bold text-foreground">
                  {formatCurrency(campaign.amount_raised)}
                </span>
                <span className="text-sm text-muted-foreground font-medium">{pct}%</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                raised of {formatCurrency(campaign.goal_amount)} goal
              </p>
              <Progress value={pct} className="h-3 rounded-full" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Users className="w-5 h-5 text-[#6C63FF] mx-auto mb-1" />
                <p className="font-semibold text-lg">{donorCount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">donors</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Clock className="w-5 h-5 text-[#4F8CFF] mx-auto mb-1" />
                <p className="font-semibold text-lg">{remaining ?? "—"}</p>
                <p className="text-xs text-muted-foreground">days left</p>
              </div>
            </div>

            {/* Donate CTA */}
            <Button
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#6C63FF] to-[#4F8CFF] hover:opacity-90"
            >
              <Heart className="w-5 h-5 mr-2 fill-white" /> Donate Now
            </Button>

            {/* Share */}
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="w-full flex items-center justify-center gap-2 text-sm text-[#6C63FF] font-medium py-2 border border-[#6C63FF]/30 rounded-xl hover:bg-[#6C63FF]/5 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share this campaign
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Powered by{" "}
              <span className="font-semibold text-[#6C63FF]">Cre8Gre8</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-[#6C63FF] to-[#4F8CFF] flex items-center justify-center">
            <Heart className="w-3 h-3 text-white fill-white" />
          </div>
          <span className="font-semibold text-sm bg-gradient-to-r from-[#6C63FF] to-[#4F8CFF] bg-clip-text text-transparent">
            Cre8Gre8
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Making giving simple, transparent, and impactful.
        </p>
      </footer>
    </div>
  );
}
