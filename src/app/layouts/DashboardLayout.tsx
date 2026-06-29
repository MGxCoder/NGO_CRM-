import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../lib/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  FileHeart,
  FileText,
  MessageSquare,
  Megaphone,
  Bot,
  BarChart3,
  Settings,
  Search,
  Bell,
  Heart,
  DollarSign,
  AlertTriangle,
  Calendar,
  LogOut,
  Loader2,
  User,
  Mail,
} from "lucide-react";
import { Badge } from "../components/ui/badge";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Donors", path: "/dashboard/donors", icon: Users },
  { name: "Impact Stories", path: "/dashboard/impact-stories", icon: FileHeart },
  { name: "Reports", path: "/dashboard/reports", icon: FileText },
  { name: "Engagement", path: "/dashboard/engagement", icon: MessageSquare },
  { name: "Campaigns", path: "/dashboard/campaigns", icon: Megaphone },
  { name: "Email Templates", path: "/dashboard/email-templates", icon: Mail },
  { name: "AI Assistant", path: "/dashboard/ai-assistant", icon: Bot },
  { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

const notifications = [
  {
    id: 1,
    icon: DollarSign,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
    title: "New donation received",
    description: "Sarah Johnson donated $500",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-100",
    title: "Donor at risk",
    description: "David Brown hasn't engaged in 90 days",
    time: "3 hours ago",
    unread: true,
  },
  {
    id: 3,
    icon: Calendar,
    iconColor: "text-[#6C63FF]",
    iconBg: "bg-[#6C63FF]/10",
    title: "Campaign scheduled",
    description: "Monthly Impact Report goes out today at 2 PM",
    time: "5 hours ago",
    unread: true,
  },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(notifications.filter((n) => n.unread).length);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleOpenNotifications = () => {
    setUnreadCount(0);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const displayName =
    user?.user_metadata?.first_name && user?.user_metadata?.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
      : user?.email?.split("@")[0] ?? "User";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const orgName = user?.user_metadata?.org_name ?? "Your Organization";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#6C63FF]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#4F8CFF] flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-[#6C63FF] to-[#4F8CFF] bg-clip-text text-transparent">
              Cre8Gre8
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => item.path !== "#" && navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#6C63FF]/10 text-[#6C63FF]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-[#6C63FF] text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{orgName}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-600 hover:bg-red-50 flex-shrink-0"
              title="Sign out"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search donors, campaigns, stories..."
                  className="pl-10 bg-gray-50 border-0"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <DropdownMenu onOpenChange={(open) => open && handleOpenNotifications()}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#4F8CFF] text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <span className="text-xs text-muted-foreground font-normal">{notifications.length} total</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3 cursor-pointer">
                        <div className={`w-8 h-8 rounded-full ${notification.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className={`w-4 h-4 ${notification.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-snug">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-center text-sm text-[#6C63FF] justify-center cursor-pointer"
                    onClick={() => navigate("/dashboard/engagement")}
                  >
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Avatar with dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback className="bg-[#6C63FF] text-white">{initials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="font-medium">{displayName}</div>
                    <div className="text-xs text-muted-foreground font-normal">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                    <User className="w-4 h-4 mr-2" />
                    Profile & Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
