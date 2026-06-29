import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardHome } from "./pages/DashboardHome";
import { DonorManagement } from "./pages/DonorManagement";
import { AddDonor } from "./pages/AddDonor";
import { ImpactStories } from "./pages/ImpactStories";
import { AddImpactStory } from "./pages/AddImpactStory";
import { AIReportGenerator } from "./pages/AIReportGenerator";
import { EngagementCenter } from "./pages/EngagementCenter";
import { AIAssistant } from "./pages/AIAssistant";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { CampaignManagement } from "./pages/CampaignManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
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
      { path: "reports", Component: AIReportGenerator },
      { path: "engagement", Component: EngagementCenter },
      { path: "campaigns", Component: CampaignManagement },
      { path: "ai-assistant", Component: AIAssistant },
      { path: "analytics", Component: Analytics },
      { path: "settings", Component: Settings },
    ],
  },
]);
