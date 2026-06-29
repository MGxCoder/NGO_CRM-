import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Heart, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";

export function SignupPage() {
  const navigate = useNavigate();
  const { signUp, resendConfirmation } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;
    const orgName = form.get("orgName") as string;
    const orgType = form.get("orgType") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    const { error, needsConfirmation } = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
      org_name: orgName,
      org_type: orgType,
    });
    setIsSubmitting(false);

    if (error) {
      toast.error("Sign up failed", { description: error });
      return;
    }

    if (needsConfirmation) {
      setConfirmEmail(email);
      return;
    }

    toast.success("Account created! Welcome to Cre8Gre8.");
    navigate("/dashboard", { replace: true });
  };

  const handleResend = async () => {
    if (!confirmEmail) return;
    const { error } = await resendConfirmation(confirmEmail);
    if (error) {
      toast.error("Could not resend email", { description: error });
    } else {
      toast.success("Confirmation email resent — check your inbox.");
    }
  };

  if (confirmEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#6C63FF]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#6C63FF]" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Check your email</h2>
          <p className="text-muted-foreground mb-6">
            We sent a confirmation link to <strong>{confirmEmail}</strong>. Click it to activate your account.
          </p>
          <Button variant="outline" onClick={handleResend} className="mb-4 w-full">
            Resend confirmation email
          </Button>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-[#6C63FF] hover:underline"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side — Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#4F8CFF] flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-semibold bg-gradient-to-r from-[#6C63FF] to-[#4F8CFF] bg-clip-text text-transparent">
                Cre8Gre8
              </span>
            </div>
            <p className="text-muted-foreground">AI-Powered Donor Relationship Intelligence</p>
          </div>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Register your organization</CardTitle>
              <CardDescription>Start your free trial — no credit card required</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Organization */}
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input
                    id="orgName"
                    name="orgName"
                    placeholder="Global Hope Foundation"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="orgType">Organization Type *</Label>
                    <Select name="orgType" required>
                      <SelectTrigger id="orgType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ngo">NGO</SelectItem>
                        <SelectItem value="nonprofit">Nonprofit</SelectItem>
                        <SelectItem value="charity">Charity</SelectItem>
                        <SelectItem value="foundation">Foundation</SelectItem>
                        <SelectItem value="social-enterprise">Social Enterprise</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select name="country" required>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="gb">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="in">India</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contact Person */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" name="firstName" placeholder="Jane" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" name="lastName" placeholder="Smith" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Work Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@yourorg.org"
                    required
                  />
                </div>

                {/* Password */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <input type="checkbox" id="terms" className="mt-1 rounded" required />
                  <label htmlFor="terms" className="text-muted-foreground">
                    I agree to the{" "}
                    <a href="#" className="text-[#6C63FF] hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-[#6C63FF] hover:underline">Privacy Policy</a>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#6C63FF] hover:bg-[#5A52D5]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    "Create Free Account"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-[#6C63FF] hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>

      {/* Right Side — Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#6C63FF] to-[#4F8CFF] items-center justify-center p-12">
        <div className="text-white max-w-lg">
          <h2 className="text-3xl font-semibold mb-4">Everything your NGO needs</h2>
          <p className="text-white/80 text-lg mb-8">
            Join hundreds of nonprofits using Cre8Gre8 to retain donors, automate reporting, and maximize impact.
          </p>
          <div className="space-y-4">
            {[
              "Unlimited donor profiles & segmentation",
              "AI-powered impact reports in one click",
              "Automated email & WhatsApp campaigns",
              "Real-time fundraising analytics",
              "Campaign & event management",
              "14-day free trial, cancel anytime",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
