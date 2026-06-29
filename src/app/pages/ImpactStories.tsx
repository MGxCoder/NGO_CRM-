import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Search, Filter, FileText, MapPin, Calendar } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useTenantId } from "../lib/useTenant";

interface ImpactStory {
  id: string;
  title: string;
  program: string;
  location: string;
  date: string;
  status: string;
  image_url: string | null;
  description: string;
}

export function ImpactStories() {
  const navigate = useNavigate();
  const tenantId = useTenantId();
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (tenantId) fetchStories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const fetchStories = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("impact_stories")
      .select("id, title, program, location, date, status, image_url, description")
      .order("created_at", { ascending: false });

    if (!error && data) setStories(data);
    setLoading(false);
  };

  const filtered = stories.filter((s) => {
    const matchSearch =
      search === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchProgram =
      programFilter === "all" || s.program.toLowerCase().includes(programFilter.toLowerCase());
    const matchStatus =
      statusFilter === "all" || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchProgram && matchStatus;
  });

  const getStatusColor = (status: string) => {
    if (status === "Published") return "bg-green-100 text-green-800";
    if (status === "Draft") return "bg-gray-100 text-gray-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Impact Stories</h1>
          <p className="text-muted-foreground">Share compelling stories of your organization's impact</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button onClick={() => navigate("/dashboard/impact-stories/add")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
            <Plus className="w-4 h-4 mr-2" />
            Add Story
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search stories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-gray-50 border-0"
                />
              </div>
            </div>

            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-[180px] bg-gray-50 border-0">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="water">Clean Water</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="climate">Climate Action</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-gray-50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-muted-foreground">Loading stories...</div>
      )}

      {/* Stories Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((story) => (
            <Card
              key={story.id}
              onClick={() => navigate(`/dashboard/impact-stories/${story.id}`)}
              className="border-border/50 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
            >
              <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                {story.image_url ? (
                  <img
                    src={story.image_url}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <FileText className="w-12 h-12" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getStatusColor(story.status)}>{story.status}</Badge>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>

                <h3 className="font-semibold mb-2 line-clamp-2">{story.title}</h3>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {story.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-[#6C63FF]"></div>
                    <span>{story.program}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{story.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{story.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#6C63FF]/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#6C63FF]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No impact stories yet</h3>
              <p className="text-muted-foreground mb-4">
                Start creating impact stories to share with your donors
              </p>
              <Button onClick={() => navigate("/dashboard/impact-stories/add")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Story
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
