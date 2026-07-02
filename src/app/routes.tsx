import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardHome } from "./pages/DashboardHome";
import { DonorManagement } from "./pages/DonorManagement";
import { AddDonor } from "./pages/AddDonor";
import { ImpactStories } from "./pages/ImpactStories";
import { AddImpactStory } from "./pages/AddImpactStory";
import { ImpactStoryDetail } from "./pages/ImpactStoryDetail";
import { AIReportGenerator } from "./pages/AIReportGenerator";
import { EngagementCenter } from "./pages/EngagementCenter";
import { AIAssistant } from "./pages/AIAssistant";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { CampaignManagement } from "./pages/CampaignManagement";
import { DonationsManagement } from "./pages/DonationsManagement";
import { CampaignLandingPage } from "./pages/CampaignLandingPage";
import { EmailTemplates } from "./pages/EmailTemplates";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  // Public campaign landing page (no auth required)
  {
    path: "/campaign/:id",
    Component: CampaignLandingPage,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardHome },
      { path: "donors", Component: DonorManagement },
      { path: "donors/add", Component: AddDonor },
      { path: "impact-stories", Component: ImpactStories },
      { path: "impact-stories/add", Component: AddImpactStory },
      { path: "impact-stories/:id", Component: ImpactStoryDetail },
      { path: "reports", Component: AIReportGenerator },
      { path: "engagement", Component: EngagementCenter },
      { path: "campaigns", Component: CampaignManagement },
      { path: "donations", Component: DonationsManagement },
      { path: "email-templates", Component: EmailTemplates },
      { path: "ai-assistant", Component: AIAssistant },
      { path: "analytics", Component: Analytics },
      { path: "settings", Component: Settings },
    ],
  },
]);
