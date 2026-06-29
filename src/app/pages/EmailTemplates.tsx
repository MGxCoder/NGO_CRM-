import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Copy, Check, Mail, Eye, Send, Edit3, ChevronRight } from "lucide-react";

/* ─── Template definitions ─────────────────────────────────────────── */
interface Template {
  id: string;
  name: string;
  category: string;
  subject: string;
  preview: string;
  build: (vars: Vars) => string;
}

interface Vars {
  orgName: string;
  donorName: string;
  amount: string;
  programName: string;
  ctaUrl: string;
  month: string;
}

const baseStyle = `
  body{margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;}
  .wrapper{max-width:600px;margin:0 auto;background:#f4f4f7;padding:32px 16px;}
  .card{background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.07);}
  .header{background:linear-gradient(135deg,#6C63FF 0%,#4F8CFF 100%);padding:40px 32px;text-align:center;}
  .header h1{color:#ffffff;font-size:26px;font-weight:700;margin:0 0 6px;}
  .header p{color:rgba(255,255,255,.8);font-size:14px;margin:0;}
  .body{padding:32px;}
  .body h2{font-size:20px;font-weight:700;color:#1a1a2e;margin:0 0 12px;}
  .body p{font-size:15px;line-height:1.7;color:#4a4a68;margin:0 0 16px;}
  .body p.small{font-size:13px;color:#888;}
  .stat-row{display:flex;gap:12px;margin:20px 0;}
  .stat{flex:1;background:#f4f4f7;border-radius:12px;padding:16px;text-align:center;}
  .stat .num{font-size:24px;font-weight:700;color:#6C63FF;}
  .stat .lbl{font-size:12px;color:#888;margin-top:4px;}
  .cta{display:block;background:linear-gradient(135deg,#6C63FF 0%,#4F8CFF 100%);color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 28px;border-radius:10px;text-align:center;margin:24px 0;}
  .divider{border:none;border-top:1px solid #ebebf0;margin:24px 0;}
  .quote{border-left:4px solid #6C63FF;padding:12px 16px;background:#f8f7ff;border-radius:0 8px 8px 0;margin:20px 0;font-style:italic;color:#4a4a68;font-size:14px;}
  .footer{padding:24px 32px;text-align:center;}
  .footer p{font-size:12px;color:#aaa;margin:0 0 4px;}
  .footer a{color:#6C63FF;text-decoration:none;}
`;

const templates: Template[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    category: "Onboarding",
    subject: "Welcome to {{orgName}} – You're making a difference! 🎉",
    preview: "A warm welcome for new donors joining your community.",
    build: (v) => `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
<div class="wrapper"><div class="card">
  <div class="header">
    <h1>Welcome to ${v.orgName}</h1>
    <p>We're so glad you're here</p>
  </div>
  <div class="body">
    <h2>Hi ${v.donorName},</h2>
    <p>Thank you for joining our community of changemakers! Your decision to support <strong>${v.orgName}</strong> means the world to us — and to the people whose lives you're helping transform.</p>
    <p>Here's what you can expect from us:</p>
    <ul style="color:#4a4a68;font-size:15px;line-height:2;">
      <li>Regular updates on how your contributions create impact</li>
      <li>Stories from the communities we serve</li>
      <li>Transparency reports on where every dollar goes</li>
    </ul>
    <hr class="divider"/>
    <p>Ready to see the change you're already a part of?</p>
    <a href="${v.ctaUrl}" class="cta">Explore Our Impact</a>
    <p class="small">Questions? Just reply to this email — we'd love to hear from you.</p>
  </div>
  <div class="footer">
    <p>You're receiving this because you signed up at <a href="#">${v.orgName}.org</a></p>
    <p><a href="#">Unsubscribe</a> · <a href="#">Privacy Policy</a></p>
  </div>
</div></div></body></html>`,
  },
  {
    id: "thank-you",
    name: "Donation Thank You",
    category: "Transactions",
    subject: "Your gift of {{amount}} is already making an impact ❤️",
    preview: "Personalised thank-you receipt after a donation.",
    build: (v) => `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
<div class="wrapper"><div class="card">
  <div class="header">
    <h1>Thank You, ${v.donorName}!</h1>
    <p>Your generosity changes lives</p>
  </div>
  <div class="body">
    <h2>We received your donation 🎉</h2>
    <div class="stat-row">
      <div class="stat"><div class="num">${v.amount}</div><div class="lbl">Donated</div></div>
      <div class="stat"><div class="num">${v.programName}</div><div class="lbl">Program Supported</div></div>
    </div>
    <p>Your gift will directly fund <strong>${v.programName}</strong>. Thanks to supporters like you, we're able to create measurable, lasting change for the communities we serve.</p>
    <div class="quote">"Every dollar that comes in goes straight to work. We see it in the faces of the people we help every single day." — Field Director, ${v.orgName}</div>
    <a href="${v.ctaUrl}" class="cta">See Your Impact</a>
    <hr class="divider"/>
    <p class="small">A tax receipt for your records has been attached to this email. Please keep it for your tax filing.</p>
  </div>
  <div class="footer">
    <p>${v.orgName} is a registered 501(c)(3) nonprofit. EIN: 12-3456789</p>
    <p><a href="#">Unsubscribe</a> · <a href="#">Privacy Policy</a></p>
  </div>
</div></div></body></html>`,
  },
  {
    id: "monthly-impact",
    name: "Monthly Impact Report",
    category: "Reports",
    subject: "Your ${v.month} Impact Report from {{orgName}} 📊",
    preview: "Monthly summary of impact metrics sent to all donors.",
    build: (v) => `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
<div class="wrapper"><div class="card">
  <div class="header">
    <h1>${v.month} Impact Report</h1>
    <p>Here's what your support achieved</p>
  </div>
  <div class="body">
    <h2>Hi ${v.donorName},</h2>
    <p>Every month, we compile a transparent report of exactly what your support made possible. Here's a snapshot of ${v.month}:</p>
    <div class="stat-row">
      <div class="stat"><div class="num">1,240</div><div class="lbl">Lives Impacted</div></div>
      <div class="stat"><div class="num">$48,000</div><div class="lbl">Funds Deployed</div></div>
      <div class="stat"><div class="num">3</div><div class="lbl">Projects Completed</div></div>
    </div>
    <hr class="divider"/>
    <h2>Spotlight: ${v.programName}</h2>
    <p>This month, our <strong>${v.programName}</strong> program reached a major milestone. Families in three communities now have reliable access to resources they previously had to travel hours to obtain.</p>
    <div class="quote">"I never imagined this would happen in my lifetime. This changes everything for my children." — Community member</div>
    <a href="${v.ctaUrl}" class="cta">Read the Full Report</a>
    <p class="small">Want to increase your impact? <a href="${v.ctaUrl}" style="color:#6C63FF;">Set up a monthly gift</a></p>
  </div>
  <div class="footer">
    <p>© 2026 ${v.orgName}. All rights reserved.</p>
    <p><a href="#">Unsubscribe</a> · <a href="#">Update Preferences</a></p>
  </div>
</div></div></body></html>`,
  },
  {
    id: "campaign-launch",
    name: "Campaign Launch",
    category: "Campaigns",
    subject: "🚀 We're launching {{programName}} — and we need you!",
    preview: "Campaign announcement email with goal, CTA, and urgency.",
    build: (v) => `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
<div class="wrapper"><div class="card">
  <div class="header">
    <h1>Campaign Launched!</h1>
    <p>${v.programName} · Help us reach our goal</p>
  </div>
  <div class="body">
    <h2>Hi ${v.donorName},</h2>
    <p>We have exciting news! Today, <strong>${v.orgName}</strong> is officially launching our newest campaign: <strong>${v.programName}</strong>.</p>
    <p>Our goal is to raise <strong>${v.amount}</strong> by the end of this month to fund this initiative. Every contribution — no matter the size — brings us one step closer.</p>
    <div class="stat-row">
      <div class="stat"><div class="num">${v.amount}</div><div class="lbl">Goal</div></div>
      <div class="stat"><div class="num">30</div><div class="lbl">Days Left</div></div>
      <div class="stat"><div class="num">0%</div><div class="lbl">Funded</div></div>
    </div>
    <a href="${v.ctaUrl}" class="cta">🎯 Donate to the Campaign</a>
    <hr class="divider"/>
    <p>Help us spread the word! Share this campaign with friends and family who care about making a difference.</p>
    <p class="small">You're receiving this because you're a valued supporter of ${v.orgName}.</p>
  </div>
  <div class="footer">
    <p><a href="#">Unsubscribe</a> · <a href="#">View in Browser</a></p>
  </div>
</div></div></body></html>`,
  },
  {
    id: "reengagement",
    name: "Re-engagement",
    category: "Retention",
    subject: "We miss you, {{donorName}} — here's what you've helped build",
    preview: "Win back lapsed donors with an impact story and gentle nudge.",
    build: (v) => `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
<div class="wrapper"><div class="card">
  <div class="header">
    <h1>We've been thinking about you</h1>
    <p>Here's the difference you've already made</p>
  </div>
  <div class="body">
    <h2>Hi ${v.donorName},</h2>
    <p>It's been a while, and we wanted to reach out — not to ask for anything right away, but simply to share what your past support made possible.</p>
    <div class="quote">"The well they built changed our whole community. My daughters don't miss school anymore." — Beneficiary</div>
    <p>Since your last gift, <strong>${v.orgName}</strong> has:</p>
    <ul style="color:#4a4a68;font-size:15px;line-height:2.1;">
      <li>Reached 5,000+ new beneficiaries across 4 regions</li>
      <li>Completed 12 new community projects</li>
      <li>Distributed $320,000 in direct program funding</li>
    </ul>
    <hr class="divider"/>
    <p>When you're ready, we'd love to welcome you back.</p>
    <a href="${v.ctaUrl}" class="cta">Reconnect &amp; Give Today</a>
    <p class="small">No pressure — we just want you to know the door is always open.</p>
  </div>
  <div class="footer">
    <p><a href="#">Unsubscribe</a> · <a href="#">Update Preferences</a></p>
  </div>
</div></div></body></html>`,
  },
  {
    id: "birthday",
    name: "Birthday / Anniversary",
    category: "Retention",
    subject: "🎂 Happy Birthday, {{donorName}}! A gift from us to you",
    preview: "Personalised birthday or donation-anniversary email.",
    build: (v) => `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
<div class="wrapper"><div class="card">
  <div class="header">
    <h1>Happy Birthday, ${v.donorName}! 🎉</h1>
    <p>Wishing you a wonderful day</p>
  </div>
  <div class="body">
    <p>On your special day, we wanted to take a moment to celebrate <em>you</em> — because without supporters like you, none of our work would be possible.</p>
    <p>As a small birthday gift, we'd love to share a story of impact that happened this month in your honour:</p>
    <div class="quote">"Today, 200 children attended their first day of school in a building that donors helped us build. Days like this are why we do what we do."</div>
    <hr class="divider"/>
    <p>What better way to mark a birthday than knowing you're part of something bigger?</p>
    <a href="${v.ctaUrl}" class="cta">See More Impact Stories</a>
    <p class="small">With gratitude and warm wishes,<br/><strong>${v.orgName} Team</strong></p>
  </div>
  <div class="footer">
    <p><a href="#">Unsubscribe</a> · <a href="#">Privacy Policy</a></p>
  </div>
</div></div></body></html>`,
  },
];

const categories = ["All", ...Array.from(new Set(templates.map((t) => t.category)))];

/* ─── Component ─────────────────────────────────────────────────────── */
export function EmailTemplates() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<Template>(templates[0]);
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [copied, setCopied] = useState(false);
  const [vars, setVars] = useState<Vars>({
    orgName: "Cre8Gre8",
    donorName: "Sarah",
    amount: "$250",
    programName: "Clean Water Initiative",
    ctaUrl: "https://cre8gre8.org/donate",
    month: "June 2026",
  });

  const filteredTemplates =
    activeCategory === "All" ? templates : templates.filter((t) => t.category === activeCategory);

  const html = selected.build(vars);
  const subject = selected.subject
    .replace(/\{\{orgName\}\}/g, vars.orgName)
    .replace(/\{\{donorName\}\}/g, vars.donorName)
    .replace(/\{\{amount\}\}/g, vars.amount)
    .replace(/\{\{programName\}\}/g, vars.programName);

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setVar = (key: keyof Vars, val: string) =>
    setVars((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left panel – template list */}
      <aside className="w-72 bg-white border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">
            Email Templates
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-[#6C63FF] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredTemplates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setSelected(tmpl)}
              className={`w-full text-left rounded-xl px-3 py-3 transition-colors group ${
                selected.id === tmpl.id
                  ? "bg-[#6C63FF]/10 border border-[#6C63FF]/30"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${selected.id === tmpl.id ? "text-[#6C63FF]" : "text-foreground"}`}>
                    {tmpl.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tmpl.preview}</p>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ml-2 ${selected.id === tmpl.id ? "text-[#6C63FF]" : "text-gray-300 group-hover:text-gray-400"}`} />
              </div>
              <Badge className="mt-2 text-xs bg-gray-100 text-gray-600 border-0">{tmpl.category}</Badge>
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-border px-6 py-3 flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Mail className="w-4 h-4 text-[#6C63FF] shrink-0" />
            <span className="text-sm font-medium truncate">{selected.name}</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-xs text-muted-foreground truncate">{subject}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setMode("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mode === "preview" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => setMode("edit")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mode === "edit" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Variables
              </button>
            </div>
            <Button variant="outline" size="sm" onClick={copyHtml}>
              {copied ? <Check className="w-4 h-4 mr-1.5 text-green-600" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied ? "Copied!" : "Copy HTML"}
            </Button>
            <Button size="sm" className="bg-[#6C63FF] hover:bg-[#5A52D5]">
              <Send className="w-4 h-4 mr-1.5" /> Send Test
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {mode === "preview" ? (
            <div className="p-8">
              {/* Subject line */}
              <div className="max-w-2xl mx-auto mb-4 bg-white rounded-xl px-4 py-3 border border-border/50 shadow-sm">
                <p className="text-xs text-muted-foreground mb-0.5">Subject:</p>
                <p className="text-sm font-medium">{subject}</p>
              </div>
              {/* Email preview */}
              <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  srcDoc={html}
                  title="Email Preview"
                  className="w-full border-0"
                  style={{ height: "700px" }}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          ) : (
            <div className="p-8 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 space-y-5">
                <div>
                  <h3 className="font-semibold mb-1">Customize Template Variables</h3>
                  <p className="text-sm text-muted-foreground">
                    These values replace the placeholders in the email.
                  </p>
                </div>
                <Separator />
                {(
                  [
                    { key: "orgName", label: "Organization Name", placeholder: "Cre8Gre8" },
                    { key: "donorName", label: "Donor Name", placeholder: "Sarah" },
                    { key: "amount", label: "Donation Amount", placeholder: "$250" },
                    { key: "programName", label: "Program Name", placeholder: "Clean Water Initiative" },
                    { key: "ctaUrl", label: "CTA Button URL", placeholder: "https://yoursite.org/donate" },
                    { key: "month", label: "Month / Period", placeholder: "June 2026" },
                  ] as { key: keyof Vars; label: string; placeholder: string }[]
                ).map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <Label htmlFor={key} className="text-sm">{label}</Label>
                    <Input
                      id={key}
                      value={vars[key]}
                      onChange={(e) => setVar(key, e.target.value)}
                      placeholder={placeholder}
                      className="bg-gray-50"
                    />
                  </div>
                ))}
                <Button
                  onClick={() => setMode("preview")}
                  className="w-full bg-[#6C63FF] hover:bg-[#5A52D5]"
                >
                  <Eye className="w-4 h-4 mr-2" /> Preview Updated Email
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
