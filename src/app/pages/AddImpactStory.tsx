import { useState, useRef } from "react";
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
import { ArrowLeft, Save, Upload, Image as ImageIcon, Sparkles, X } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export function AddImpactStory() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [program, setProgram] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [metric1, setMetric1] = useState("");
  const [metric2, setMetric2] = useState("");
  const [metric3, setMetric3] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialQuote, setTestimonialQuote] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (submitStatus: "Published" | "Draft") => {
    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase is not configured. Check your environment variables.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("impact-stories")
          .upload(fileName, imageFile, { upsert: false });
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
        const { data: urlData } = supabase.storage
          .from("impact-stories")
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("impact_stories").insert({
        title,
        description,
        program,
        beneficiaries: beneficiaries ? parseInt(beneficiaries) : null,
        location,
        date,
        status: submitStatus,
        image_url: imageUrl,
        metric1: metric1 || null,
        metric2: metric2 || null,
        metric3: metric3 || null,
        total_cost: totalCost ? parseFloat(totalCost) : null,
        testimonial_name: testimonialName || null,
        testimonial_quote: testimonialQuote || null,
      });
      if (insertError) throw new Error(insertError.message);

      navigate("/dashboard/impact-stories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="max-w-4xl space-y-6">
        {/* Photo Upload */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageSelect}
            />
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-gray-100">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">Drag & drop photo here</p>
                <p className="text-xs text-muted-foreground mb-3">or click to browse</p>
                <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Supports: JPG, PNG, WebP (Max 5 MB)
                </p>
              </div>
            )}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Clean Water Transforms Village"
                className="bg-input-background"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Story Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                <Select value={program} onValueChange={setProgram} required>
                  <SelectTrigger id="program" className="bg-input-background">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clean Water Initiative">Clean Water Initiative</SelectItem>
                    <SelectItem value="Education Fund">Education Fund</SelectItem>
                    <SelectItem value="Healthcare Access">Healthcare Access</SelectItem>
                    <SelectItem value="Climate Action">Climate Action</SelectItem>
                    <SelectItem value="Emergency Relief">Emergency Relief</SelectItem>
                    <SelectItem value="Economic Development">Economic Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiaries">Number of Beneficiaries</Label>
                <Input
                  id="beneficiaries"
                  type="number"
                  value={beneficiaries}
                  onChange={(e) => setBeneficiaries(e.target.value)}
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                  value={metric1}
                  onChange={(e) => setMetric1(e.target.value)}
                  placeholder="e.g., 500 families"
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metric2">Metric 2</Label>
                <Input
                  id="metric2"
                  value={metric2}
                  onChange={(e) => setMetric2(e.target.value)}
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
                  value={metric3}
                  onChange={(e) => setMetric3(e.target.value)}
                  placeholder="e.g., 95% satisfaction"
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalCost">Total Program Cost</Label>
                <Input
                  id="totalCost"
                  type="number"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
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
                value={testimonialName}
                onChange={(e) => setTestimonialName(e.target.value)}
                placeholder="Beneficiary name"
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testimonialQuote">Quote</Label>
              <Textarea
                id="testimonialQuote"
                value={testimonialQuote}
                onChange={(e) => setTestimonialQuote(e.target.value)}
                placeholder="Add a testimonial quote from a beneficiary..."
                className="bg-input-background min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            disabled={isSubmitting || !title || !description || !program || !location || !date}
            onClick={() => handleSubmit("Published")}
            className="bg-[#6C63FF] hover:bg-[#5A52D5]"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Publishing..." : "Publish Story"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting || !title || !description || !program || !location || !date}
            onClick={() => handleSubmit("Draft")}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => navigate("/dashboard/impact-stories")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
