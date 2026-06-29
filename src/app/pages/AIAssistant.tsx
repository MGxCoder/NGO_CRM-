import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Sparkles, Send, TrendingDown, FileText, Lightbulb, Mail } from "lucide-react";

const promptSuggestions = [
  {
    icon: TrendingDown,
    title: "Show donors at risk",
    description: "Identify donors who haven't engaged recently",
    color: "#FF6B6B",
  },
  {
    icon: FileText,
    title: "Generate monthly report",
    description: "Create an impact report for this month",
    color: "#6C63FF",
  },
  {
    icon: Lightbulb,
    title: "Suggest donor engagement ideas",
    description: "Get personalized engagement strategies",
    color: "#4F8CFF",
  },
  {
    icon: Mail,
    title: "Create thank-you email",
    description: "Generate a personalized thank you message",
    color: "#A29DFF",
  },
];

const chatHistory = [
  {
    role: "user",
    message: "Show me donors at risk of churning",
    timestamp: "10:30 AM",
  },
  {
    role: "assistant",
    message: "I found 12 donors who haven't engaged in the last 90 days. Here's a breakdown:\n\n• David Brown - Last donation: May 25 (32 days ago)\n• James Wilson - Last donation: April 15 (67 days ago)\n• Patricia Martinez - Last donation: March 28 (85 days ago)\n\nWould you like me to:\n1. Generate personalized re-engagement emails for these donors\n2. Show their donation history and preferences\n3. Create a targeted campaign for this segment",
    timestamp: "10:30 AM",
  },
  {
    role: "user",
    message: "Generate personalized emails for these donors",
    timestamp: "10:32 AM",
  },
  {
    role: "assistant",
    message: "I've generated personalized re-engagement emails for each donor based on their interests and donation history. Here's an example for David Brown:\n\n---\n\nSubject: We Miss You, David! 🌟\n\nDear David,\n\nIt's been a while since we last connected, and we wanted to reach out personally to share some exciting updates from our Emergency Relief program - a cause close to your heart.\n\nThanks to supporters like you, we've been able to:\n• Deliver aid to 1,500 families in crisis\n• Establish 3 new emergency response centers\n• Train 50 local volunteers in disaster response\n\nYour past contribution of $600 made a real difference. Would you like to see the full impact of your donation?\n\n[View Your Impact Report]\n\nWarm regards,\nThe Cre8Gre8 Team\n\n---\n\nWould you like to:\n1. Review all generated emails\n2. Schedule these emails to send\n3. Customize any of the messages",
    timestamp: "10:32 AM",
  },
];

export function AIAssistant() {
  const [messages, setMessages] = useState(chatHistory);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      role: "user",
      message: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        message: "I'm processing your request. This is a demo response showing how the AI assistant would help you with donor management tasks.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#6C63FF]" />
          AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Your intelligent assistant for donor management and engagement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prompt Suggestions */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {promptSuggestions.map((suggestion, idx) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion.title)}
                    className="w-full text-left border rounded-lg p-3 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${suggestion.color}15` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: suggestion.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium mb-1">{suggestion.title}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-gradient-to-br from-[#6C63FF]/5 to-[#4F8CFF]/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#6C63FF] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1 text-sm">AI Insights</h4>
                  <p className="text-xs text-muted-foreground">
                    The AI has analyzed your donor data and can provide personalized recommendations for improving retention and engagement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-sm flex flex-col" style={{ height: "calc(100vh - 280px)" }}>
            <CardHeader className="border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#4F8CFF] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-[#6C63FF] to-[#4F8CFF] text-white">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.role === "user"
                        ? "bg-[#6C63FF] text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.message}</p>
                    <p
                      className={`text-xs mt-2 ${
                        msg.role === "user" ? "text-white/70" : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                  {msg.role === "user" && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-[#6C63FF]/10 text-[#6C63FF]">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </CardContent>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything about your donors..."
                  className="flex-1 bg-gray-50 border-0"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="bg-[#6C63FF] hover:bg-[#5A52D5]"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Try asking about donor insights, generating reports, or creating campaigns
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
