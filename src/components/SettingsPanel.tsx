import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  Palette, 
  BarChart3, 
  Key, 
  Bell,
  Download,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsPanelProps {
  apiUsage?: {
    textTokens: number;
    imageGenerations: number;
    searchQueries: number;
    dailyLimit: number;
  };
}

const SettingsPanel = ({ apiUsage }: SettingsPanelProps) => {
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [responseLength, setResponseLength] = useState([75]);
  const { toast } = useToast();

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Your data is being prepared for download"
    });
  };

  const clearData = () => {
    toast({
      title: "Data Cleared",
      description: "All local data has been removed",
      variant: "destructive"
    });
  };

  const usagePercentage = apiUsage ? 
    Math.round(((apiUsage.textTokens + apiUsage.imageGenerations + apiUsage.searchQueries) / apiUsage.dailyLimit) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
          <p className="text-muted-foreground">Customize your AI assistant experience</p>
        </div>
        <Badge variant="secondary" className="bg-accent-warm/20 text-accent-warm">
          <Settings className="h-3 w-3 mr-1" />
          Preferences
        </Badge>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* API Usage Stats */}
        {apiUsage && (
          <Card className="glass-panel p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-5 w-5 text-accent-warm" />
              <h3 className="text-lg font-semibold text-foreground">API Usage Today</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Daily Usage</span>
                  <span className="text-sm font-medium text-foreground">
                    {usagePercentage}% of limit
                  </span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-warm">
                    {apiUsage.textTokens.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Text Tokens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-warm">
                    {apiUsage.imageGenerations}
                  </div>
                  <div className="text-xs text-muted-foreground">Images</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-warm">
                    {apiUsage.searchQueries}
                  </div>
                  <div className="text-xs text-muted-foreground">Searches</div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Theme Settings */}
        <Card className="glass-panel p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="h-5 w-5 text-accent-warm" />
            <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Theme</Label>
                <p className="text-xs text-muted-foreground">Choose your preferred color scheme</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="bg-accent-warm hover:bg-accent-warm/80"
                >
                  Dark
                </Button>
                <Button
                  size="sm"
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="bg-accent-warm hover:bg-accent-warm/80"
                >
                  Light
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">
                AI Response Length: {responseLength[0]}%
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                Control how detailed AI responses should be
              </p>
              <Slider
                value={responseLength}
                onValueChange={setResponseLength}
                max={100}
                min={25}
                step={25}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Brief</span>
                <span>Balanced</span>
                <span>Detailed</span>
                <span>Comprehensive</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="glass-panel p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-accent-warm" />
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Get notified when tasks complete</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Auto-save Conversations</Label>
                <p className="text-xs text-muted-foreground">Automatically save chat history</p>
              </div>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
          </div>
        </Card>

        {/* API Keys */}
        <Card className="glass-panel p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Key className="h-5 w-5 text-accent-warm" />
            <h3 className="text-lg font-semibold text-foreground">API Configuration</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-medium-surface/50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-foreground">OpenRouter API</span>
                <p className="text-xs text-muted-foreground">For text generation</p>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500/30">
                Connected
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-medium-surface/50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-foreground">Gemini API</span>
                <p className="text-xs text-muted-foreground">For image generation</p>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500/30">
                Connected
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-medium-surface/50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-foreground">Web Search API</span>
                <p className="text-xs text-muted-foreground">For research capabilities</p>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500/30">
                Connected
              </Badge>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3">
            API keys are securely managed through Supabase Edge Functions
          </p>
        </Card>

        {/* Data Management */}
        <Card className="glass-panel p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Download className="h-5 w-5 text-accent-warm" />
            <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
          </div>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={exportData}
              className="w-full justify-start border-accent-warm/30 text-foreground hover:border-accent-warm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            
            <Button
              variant="outline"
              onClick={clearData}
              className="w-full justify-start border-destructive/30 text-destructive hover:border-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3">
            Export your conversations and generated content or clear all local data
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPanel;