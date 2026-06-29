import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Sparkles, Download, Mail, Edit, FileText } from "lucide-react";
import { Separator } from "../components/ui/separator";

export function AIReportGenerator() {
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerate = () => {
    setReportGenerated(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">AI Report Generator</h1>
        <p className="text-muted-foreground">Generate personalized impact reports for your donors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Configuration */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select defaultValue="impact">
                  <SelectTrigger id="reportType" className="bg-input-background">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impact">Impact Report</SelectItem>
                    <SelectItem value="monthly">Monthly Summary</SelectItem>
                    <SelectItem value="yearly">Annual Report</SelectItem>
                    <SelectItem value="campaign">Campaign Report</SelectItem>
                    <SelectItem value="donor-specific">Donor-Specific Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateRange">Date Range</Label>
                <Select defaultValue="last-month">
                  <SelectTrigger id="dateRange" className="bg-input-background">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="donor">Donor (Optional)</Label>
                <Select>
                  <SelectTrigger id="donor" className="bg-input-background">
                    <SelectValue placeholder="Select donor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Donors</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="michael">Michael Chen</SelectItem>
                    <SelectItem value="emma">Emma Wilson</SelectItem>
                    <SelectItem value="david">David Brown</SelectItem>
                    <SelectItem value="lisa">Lisa Anderson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="program" className="bg-input-background">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="water">Clean Water Initiative</SelectItem>
                    <SelectItem value="education">Education Fund</SelectItem>
                    <SelectItem value="healthcare">Healthcare Access</SelectItem>
                    <SelectItem value="climate">Climate Action</SelectItem>
                    <SelectItem value="emergency">Emergency Relief</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Include in Report</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Financial Summary</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Impact Stories</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Photos & Media</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Donor Testimonials</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Detailed Metrics</span>
                  </label>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full bg-[#6C63FF] hover:bg-[#5A52D5]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Preview */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Report Preview</CardTitle>
                {reportGenerated && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button size="sm" className="bg-[#4F8CFF] hover:bg-[#3D7AE8]">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!reportGenerated ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#6C63FF]/10 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-[#6C63FF]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Report Generated</h3>
                  <p className="text-muted-foreground">
                    Configure your report settings and click "Generate Report" to see a preview
                  </p>
                </div>
              ) : (
                <div className="bg-white border rounded-lg p-8 space-y-6">
                  {/* Report Header */}
                  <div className="text-center border-b pb-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#4F8CFF] flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-xl font-bold">C8</span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Impact Report</h2>
                    <p className="text-sm text-muted-foreground">May 2024</p>
                  </div>

                  {/* Dear Donor */}
                  <div>
                    <p className="text-sm">Dear Sarah,</p>
                    <p className="text-sm mt-2">
                      Thank you for your continued support. Here's a summary of the impact your donations have made this month.
                    </p>
                  </div>

                  {/* Financial Summary */}
                  <div>
                    <h3 className="font-semibold mb-3">Financial Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Your Contributions</p>
                        <p className="text-xl font-semibold text-[#6C63FF]">$2,450</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">People Helped</p>
                        <p className="text-xl font-semibold text-[#4F8CFF]">1,247</p>
                      </div>
                    </div>
                  </div>

                  {/* Impact Story */}
                  <div>
                    <h3 className="font-semibold mb-3">Your Impact This Month</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="aspect-video bg-gray-200 rounded-lg mb-2"></div>
                      <h4 className="font-medium text-sm">Clean Water Transforms Village</h4>
                      <p className="text-xs text-muted-foreground">
                        Your donation helped provide clean water access to 500 families in rural Kenya. The new well serves the entire community and has reduced water-borne diseases by 78%.
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div>
                    <h3 className="font-semibold mb-3">Key Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Wells Built</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Families Served</span>
                        <span className="font-medium">500</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Water Quality</span>
                        <span className="font-medium">98% Pure</span>
                      </div>
                    </div>
                  </div>

                  {/* Thank You */}
                  <div className="border-t pt-6">
                    <p className="text-sm text-muted-foreground">
                      Thank you for making this impact possible. Together, we're creating lasting change.
                    </p>
                    <p className="text-sm font-medium mt-2">With gratitude,</p>
                    <p className="text-sm">The Cre8Gre8 Team</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {reportGenerated && (
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-[#6C63FF]/5 to-[#4F8CFF]/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#6C63FF] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">AI Suggestion</h4>
                    <p className="text-sm text-muted-foreground">
                      This report has been personalized based on Sarah's donation history and interests. Consider adding a photo from the Clean Water Initiative to increase engagement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
