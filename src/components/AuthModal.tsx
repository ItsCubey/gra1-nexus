import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { email: string }) => void;
}

const AuthModal = ({ isOpen, onClose, onAuthSuccess }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleAuth = async (type: "signin" | "signup") => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (type === "signup" && !name) {
      toast({
        title: "Missing Information", 
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      if (type === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        onAuthSuccess({ email: data.user?.email || email });
        onClose();
        
        toast({
          title: "Welcome back!",
          description: "Successfully signed in"
        });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { full_name: name }
          }
        });
        
        if (error) throw error;
        
        if (data.user && !data.session) {
          toast({
            title: "Check your email",
            description: "Please check your email for a confirmation link"
          });
        } else {
          onAuthSuccess({ email: data.user?.email || email });
          onClose();
          toast({
            title: "Welcome to gra-1 Utility!",
            description: "Account created successfully"
          });
        }
      }
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials and try again",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: "OAuth Failed",
        description: `Failed to sign in with ${provider}`,
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-dark-surface border-accent-warm/30">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-primary-foreground">
            Welcome to gra-1 Utility
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-medium-surface">
            <TabsTrigger value="signin" className="text-muted-foreground data-[state=active]:text-accent-warm">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-muted-foreground data-[state=active]:text-accent-warm">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="signin-email" className="text-sm font-medium text-primary-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10 bg-medium-surface border-accent-warm/30 text-primary-foreground"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signin-password" className="text-sm font-medium text-primary-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-medium-surface border-accent-warm/30 text-primary-foreground"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                onClick={() => handleAuth("signin")}
                disabled={isLoading}
                className="w-full bg-accent-warm hover:bg-accent-warm/80 text-primary-foreground"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="signup-name" className="text-sm font-medium text-primary-foreground">
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="pl-10 bg-medium-surface border-accent-warm/30 text-primary-foreground"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email" className="text-sm font-medium text-primary-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10 bg-medium-surface border-accent-warm/30 text-primary-foreground"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-password" className="text-sm font-medium text-primary-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-medium-surface border-accent-warm/30 text-primary-foreground"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                onClick={() => handleAuth("signup")}
                disabled={isLoading}
                className="w-full bg-accent-warm hover:bg-accent-warm/80 text-primary-foreground"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-accent-warm/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-dark-surface px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("github")}
            disabled={isLoading}
            className="border-accent-warm/30 text-muted-foreground hover:text-accent-warm hover:border-accent-warm"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
            className="border-accent-warm/30 text-muted-foreground hover:text-accent-warm hover:border-accent-warm"
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Note: Authentication requires Supabase integration to be fully functional
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;