import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowLeft, Save, Upload, Image as ImageIcon, Video, Sparkles } from "lucide-react";

export function AddImpactStory() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard/impact-stories");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/impact-stories")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold mb-1">Create Impact Story</h1>
          <p className="text-muted-foreground">Share the impact of your programs with donors</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media Upload */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Photos</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Drag & drop photos here</p>
                  <p className="text-xs text-muted-foreground mb-3">or click to browse</p>
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Supports: JPG, PNG, WebP (Max 5MB each)
                  </p>
                </div>
              </div>

              {/* Video Upload */}
              <div className="space-y-2">
                <Label>Videos (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <Video className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Drag & drop video here</p>
                  <p className="text-xs text-muted-foreground mb-3">or click to browse</p>
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Supports: MP4, MOV, AVI (Max 100MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story Details */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Story Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Story Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Clean Water Transforms Village"
                  className="bg-input-background"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Story Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Write a compelling story about the impact of your program..."
                  className="bg-input-background min-h-[200px]"
                  required
                />
                <div className="flex justify-end">
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Story
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="program">Program *</Label>
                  <Select>
                    <SelectTrigger id="program" className="bg-input-background">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clean-water">Clean Water Initiative</SelectItem>
                      <SelectItem value="education">Education Fund</SelectItem>
                      <SelectItem value="healthcare">Healthcare Access</SelectItem>
                      <SelectItem value="climate">Climate Action</SelectItem>
                      <SelectItem value="emergency">Emergency Relief</SelectItem>
                      <SelectItem value="economic">Economic Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficiaries">Number of Beneficiaries</Label>
                  <Input
                    id="beneficiaries"
                    type="number"
                    placeholder="e.g., 500"
                    className="bg-input-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Rural Kenya"
                    className="bg-input-background"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    className="bg-input-background"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Metrics */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Impact Metrics (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metric1">Metric 1</Label>
                  <Input
                    id="metric1"
                    placeholder="e.g., 500 families"
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metric2">Metric 2</Label>
                  <Input
                    id="metric2"
                    placeholder="e.g., 2,000 liters/day"
                    className="bg-input-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metric3">Metric 3</Label>
                  <Input
                    id="metric3"
                    placeholder="e.g., 95% satisfaction"
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalCost">Total Program Cost</Label>
                  <Input
                    id="totalCost"
                    type="number"
                    placeholder="e.g., 50000"
                    className="bg-input-background"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Testimonials (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testimonialName">Name</Label>
                <Input
                  id="testimonialName"
                  placeholder="Beneficiary name"
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testimonialQuote">Quote</Label>
                <Textarea
                  id="testimonialQuote"
                  placeholder="Add a testimonial quote from a beneficiary..."
                  className="bg-input-background min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              className="bg-[#6C63FF] hover:bg-[#5A52D5]"
            >
              <Save className="w-4 h-4 mr-2" />
              Publish Story
            </Button>
            <Button
              type="button"
              variant="outline"
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/impact-stories")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
