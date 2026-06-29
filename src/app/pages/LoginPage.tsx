import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, resendConfirmation } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    setUnconfirmedEmail(null);
    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      if (error.toLowerCase().includes("email not confirmed")) {
        setUnconfirmedEmail(email);
        return;
      }
      toast.error("Sign in failed", { description: error });
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  const handleResend = async () => {
    if (!unconfirmedEmail) return;
    const { error } = await resendConfirmation(unconfirmedEmail);
    if (error) {
      toast.error("Could not resend email", { description: error });
    } else {
      toast.success("Confirmation email sent — check your inbox.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
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
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@ngo.org"
                    className="bg-input-background"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-input-background"
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-[#6C63FF] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#6C63FF] hover:bg-[#5A52D5]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                {unconfirmedEmail && (
                  <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
                    <p className="font-medium mb-1">Email not confirmed</p>
                    <p className="text-yellow-700 mb-2">Check your inbox for a confirmation link.</p>
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-[#6C63FF] hover:underline font-medium"
                    >
                      Resend confirmation email
                    </button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#6C63FF] hover:underline font-medium"
            >
              Register your organization
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#6C63FF] to-[#4F8CFF] items-center justify-center p-12">
        <div className="text-white max-w-lg">
          <div className="mb-8">
            <div className="w-64 h-64 mx-auto mb-8 bg-white/10 rounded-3xl backdrop-blur-sm flex items-center justify-center">
              <Heart className="w-32 h-32 text-white/80 fill-white/20" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-4">Transform Your Donor Relationships</h2>
          <p className="text-white/80 text-lg">
            Leverage AI to retain donors, automate impact reporting, and maximize donor lifetime value for your NGO.
          </p>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <span>Intelligent donor insights</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <span>Automated engagement tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <span>AI-powered impact stories</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
