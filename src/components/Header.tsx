import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, LogOut, User } from "lucide-react";

interface HeaderProps {
  user?: { email: string };
  onSignOut?: () => void;
  onOpenSettings?: () => void;
}

const Header = ({ user, onSignOut, onOpenSettings }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-dark-surface/95 backdrop-blur supports-[backdrop-filter]:bg-dark-surface/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-warm to-medium-surface flex items-center justify-center animate-pulse-glow">
              <span className="text-sm font-bold text-primary-foreground">G1</span>
            </div>
            <h1 className="text-xl font-semibold text-primary-foreground">
              gra-1 Utility
            </h1>
          </div>
          <Badge variant="secondary" className="bg-accent-warm/20 text-accent-warm border-accent-warm/30">
            AI Assistant Platform
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenSettings}
                className="text-muted-foreground hover:text-primary-foreground hover:bg-medium-surface"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSignOut}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" className="bg-accent-warm hover:bg-accent-warm/80">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;