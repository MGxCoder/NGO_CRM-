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

const stories = [
  {
    id: 1,
    title: "Clean Water Transforms Village",
    program: "Clean Water Initiative",
    location: "Rural Kenya",
    date: "2024-06-15",
    status: "Published",
    image: "https://images.unsplash.com/photo-1541692641319-981cc79ee10a?w=800&auto=format&fit=crop",
    excerpt: "Thanks to donor support, 500 families now have access to clean water...",
  },
  {
    id: 2,
    title: "Student Achieves Dream of Education",
    program: "Education Fund",
    location: "Manila, Philippines",
    date: "2024-06-10",
    status: "Published",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
    excerpt: "Maria's journey from struggling student to university graduate...",
  },
  {
    id: 3,
    title: "Community Health Center Opens",
    program: "Healthcare Access",
    location: "Mumbai, India",
    date: "2024-06-05",
    status: "Published",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&auto=format&fit=crop",
    excerpt: "A new health center serves 2,000 families in underserved areas...",
  },
  {
    id: 4,
    title: "Forest Restoration Success",
    program: "Climate Action",
    location: "Amazon Basin, Brazil",
    date: "2024-06-01",
    status: "Draft",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    excerpt: "10,000 trees planted, restoring critical habitat...",
  },
  {
    id: 5,
    title: "Emergency Relief Reaches Families",
    program: "Emergency Relief",
    location: "Syrian Border",
    date: "2024-05-28",
    status: "Published",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop",
    excerpt: "Critical supplies delivered to 1,500 displaced families...",
  },
  {
    id: 6,
    title: "Women's Empowerment Program Launches",
    program: "Economic Development",
    location: "Nairobi, Kenya",
    date: "2024-05-20",
    status: "Published",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop",
    excerpt: "50 women receive entrepreneurship training and microloans...",
  },
];

export function ImpactStories() {
  const navigate = useNavigate();

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
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search stories..."
                  className="pl-10 bg-gray-50 border-0"
                />
              </div>
            </div>

            {/* Program Filter */}
            <Select defaultValue="all">
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

            {/* Status Filter */}
            <Select defaultValue="all">
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

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Card
            key={story.id}
            className="border-border/50 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
          >
            <div className="aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
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
                {story.excerpt}
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

      {/* Empty State (hidden when stories exist) */}
      {stories.length === 0 && (
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
