import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/ChatPanel";
import ImagePanel from "@/components/ImagePanel";
import ResearchPanel from "@/components/ResearchPanel";
import SettingsPanel from "@/components/SettingsPanel";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const [activePanel, setActivePanel] = useState("chat");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock API usage data - would come from Supabase in real implementation
  const apiUsage = {
    textTokens: 15750,
    imageGenerations: 8,
    searchQueries: 12,
    dailyLimit: 50000
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = (userData: { email: string }) => {
    setShowAuth(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSignInClick = () => {
    setShowAuth(true);
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "chat":
        return <ChatPanel />;
      case "image":
        return <ImagePanel />;
      case "research":
        return <ResearchPanel />;
      case "settings":
        return <SettingsPanel apiUsage={apiUsage} />;
      default:
        return <ChatPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-surface text-primary-foreground">
        <Header 
          user={user ? { email: user.email || '' } : null} 
          onSignOut={handleSignOut}
          onOpenSettings={() => setActivePanel("settings")}
        />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar 
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          apiUsage={apiUsage}
        />
        
        <main className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-accent-warm border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          ) : user ? (
            renderPanel()
          ) : (
            <div className="flex items-center justify-center h-full bg-background">
              <div className="text-center space-y-6 p-8 max-w-md mx-auto">
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-warm to-medium-surface flex items-center justify-center mx-auto animate-pulse-glow">
                    <span className="text-2xl font-bold text-primary-foreground">G1</span>
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">Welcome to gra-1 Utility</h1>
                  <p className="text-muted-foreground">
                    Your advanced AI assistant platform combining text generation, image creation, and deep research capabilities.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={handleSignInClick}
                    className="w-full bg-accent-warm hover:bg-accent-warm/80 text-primary-foreground py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Get Started
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Sign in to access AI-powered tools and save your work
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                  <div className="text-center">
                    <div className="text-accent-warm font-semibold">AI Chat</div>
                    <div className="text-xs text-muted-foreground">GPT-4 & Claude</div>
                  </div>
                  <div className="text-center">
                    <div className="text-accent-warm font-semibold">Images</div>
                    <div className="text-xs text-muted-foreground">Gemini Vision</div>
                  </div>
                  <div className="text-center">
                    <div className="text-accent-warm font-semibold">Research</div>
                    <div className="text-xs text-muted-foreground">Live Web Search</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
