import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Share2,
  CheckCircle2,
  Quote,
  DollarSign,
  BarChart3,
  Heart,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface ImpactStory {
  id: string;
  title: string;
  description: string;
  program: string;
  beneficiaries: number | null;
  location: string;
  date: string;
  status: string;
  image_url: string | null;
  metric1: string | null;
  metric2: string | null;
  metric3: string | null;
  total_cost: number | null;
  testimonial_name: string | null;
  testimonial_quote: string | null;
  created_at: string;
}

export function ImpactStoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<ImpactStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) fetchStory(id);
  }, [id]);

  const fetchStory = async (storyId: string) => {
    if (!isSupabaseConfigured || !supabase) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("impact_stories")
      .select("*")
      .eq("id", storyId)
      .single();
    if (!error && data) setStory(data);
    setLoading(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    if (status === "Published") return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const metrics = story
    ? [story.metric1, story.metric2, story.metric3].filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading story...
      </div>
    );
  }

  if (!story) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard/impact-stories")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Stories
        </Button>
        <div className="mt-12 text-center text-muted-foreground">Story not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/impact-stories")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Stories
        </Button>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(story.status)}>{story.status}</Badge>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            {copied ? "Link Copied!" : "Share"}
          </Button>
          <Button size="sm" className="bg-[#6C63FF] hover:bg-[#5A52D5]"
            onClick={() => navigate(`/dashboard/impact-stories/${id}/edit`)}>
            Edit Story
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Image */}
        {story.image_url && (
          <div className="rounded-2xl overflow-hidden aspect-[21/9] shadow-lg">
            <img
              src={story.image_url}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#6C63FF]" />
            <span className="font-medium text-foreground">{story.program}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {story.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(story.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
          {story.beneficiaries && (
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {story.beneficiaries.toLocaleString()} beneficiaries
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{story.title}</h1>

        {/* Description */}
        <div className="prose prose-gray max-w-none">
          <p className="text-base leading-relaxed text-foreground whitespace-pre-line">
            {story.description}
          </p>
        </div>

        {/* Impact Metrics */}
        {(metrics.length > 0 || story.total_cost) && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-[#6C63FF]" />
                <h2 className="text-xl font-semibold">Impact at a Glance</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric, i) => (
                  <Card key={i} className="border-border/50 shadow-sm bg-white">
                    <CardContent className="p-4 text-center">
                      <CheckCircle2 className="w-6 h-6 text-[#6C63FF] mx-auto mb-2" />
                      <p className="font-semibold text-sm">{metric}</p>
                    </CardContent>
                  </Card>
                ))}
                {story.total_cost && (
                  <Card className="border-border/50 shadow-sm bg-white">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="font-semibold text-sm">
                        ${story.total_cost.toLocaleString()} invested
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}

        {/* Testimonial */}
        {story.testimonial_quote && (
          <>
            <Separator />
            <div className="bg-gradient-to-br from-[#6C63FF]/5 to-[#4F8CFF]/5 rounded-2xl p-8 relative">
              <Quote className="w-10 h-10 text-[#6C63FF]/20 absolute top-6 left-6" />
              <blockquote className="text-lg italic text-foreground leading-relaxed pl-6 pt-4">
                "{story.testimonial_quote}"
              </blockquote>
              {story.testimonial_name && (
                <div className="flex items-center gap-3 mt-6 pl-6">
                  <div className="w-10 h-10 rounded-full bg-[#6C63FF]/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#6C63FF]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{story.testimonial_name}</p>
                    <p className="text-xs text-muted-foreground">Beneficiary</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Share CTA */}
        <div className="bg-white border border-border/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Help spread the word</h3>
            <p className="text-sm text-muted-foreground">
              Share this story with your network to amplify our impact.
            </p>
          </div>
          <Button onClick={handleShare} className="bg-[#6C63FF] hover:bg-[#5A52D5] shrink-0">
            <Share2 className="w-4 h-4 mr-2" />
            {copied ? "Link Copied!" : "Copy Story Link"}
          </Button>
        </div>
      </div>
    </div>
  );
}
