import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Image, 
  Search, 
  Settings, 
  BarChart3,
  Zap
} from "lucide-react";

interface SidebarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
  apiUsage?: {
    textTokens: number;
    imageGenerations: number;
    searchQueries: number;
  };
}

const Sidebar = ({ activePanel, onPanelChange, apiUsage }: SidebarProps) => {
  const panels = [
    {
      id: "chat",
      label: "AI Assistant",
      icon: MessageSquare,
      description: "Text generation & conversation"
    },
    {
      id: "image",
      label: "Image Generator",
      icon: Image,
      description: "Create stunning visuals"
    },
    {
      id: "research",
      label: "Deep Research",
      icon: Search,
      description: "Web search & analysis"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Preferences & API usage"
    }
  ];

  return (
    <aside className="w-80 bg-dark-surface border-r border-border flex flex-col animate-slide-in-left">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-primary-foreground mb-2">
          AI Tools
        </h2>
        <p className="text-sm text-muted-foreground">
          Advanced AI capabilities at your fingertips
        </p>
      </div>

      <div className="flex-1 p-4 space-y-2">
        {panels.map((panel) => {
          const Icon = panel.icon;
          const isActive = activePanel === panel.id;
          
          return (
            <Button
              key={panel.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start h-auto p-4 ${
                isActive 
                  ? 'bg-accent-warm/20 text-accent-warm border border-accent-warm/30' 
                  : 'text-muted-foreground hover:text-primary-foreground hover:bg-medium-surface'
              }`}
              onClick={() => onPanelChange(panel.id)}
            >
              <div className="flex items-start space-x-3">
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{panel.label}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {panel.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {apiUsage && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="h-4 w-4 text-accent-warm" />
            <span className="text-sm font-medium text-primary-foreground">API Usage Today</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Text Tokens</span>
              <Badge variant="outline" className="text-accent-warm border-accent-warm/30">
                {apiUsage.textTokens.toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Images Generated</span>
              <Badge variant="outline" className="text-accent-warm border-accent-warm/30">
                {apiUsage.imageGenerations}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Search Queries</span>
              <Badge variant="outline" className="text-accent-warm border-accent-warm/30">
                {apiUsage.searchQueries}
              </Badge>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Zap className="h-3 w-3 text-accent-warm" />
          <span>Powered by OpenRouter & Gemini</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;