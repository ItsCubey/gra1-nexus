import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, ExternalLink, Globe, Clock, RefreshCw, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  domain: string;
  timestamp: string;
}

interface ResearchQuery {
  id: string;
  query: string;
  summary: string;
  results: SearchResult[];
  timestamp: Date;
}

const ResearchPanel = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [research, setResearch] = useState<ResearchQuery[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim() || isSearching) return;

    setIsSearching(true);

    try {
      const { data, error } = await supabase.functions.invoke('web-research', {
        body: { query }
      });

      if (error) throw error;

      const newResearch: ResearchQuery = {
        id: Date.now().toString(),
        query,
        summary: data.summary,
        results: data.results,
        timestamp: new Date()
      };

      setResearch(prev => [newResearch, ...prev]);
      setQuery("");
      
      toast({
        title: "Research Complete!",
        description: `Found ${data.results.length} relevant sources`
      });
    } catch (error) {
      console.error('Research error:', error);
      toast({
        title: "Search Failed",
        description: "Failed to perform web search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Deep Research</h2>
          <p className="text-muted-foreground">AI-powered web search and analysis</p>
        </div>
        <Badge variant="secondary" className="bg-accent-warm/20 text-accent-warm">
          Live Web Search
        </Badge>
      </div>

      <div className="p-6">
        <Card className="glass-panel p-4 mb-6">
          <div className="flex space-x-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your research query..."
              className="flex-1 bg-medium-surface border-accent-warm/30 text-primary-foreground placeholder:text-muted-foreground focus:border-accent-warm"
              disabled={isSearching}
            />
            <Button
              onClick={handleSearch}
              disabled={!query.trim() || isSearching}
              className="bg-accent-warm hover:bg-accent-warm/80 text-primary-foreground"
            >
              {isSearching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-6">
          {research.map((item) => (
            <Card key={item.id} className="glass-panel p-6 animate-fade-in-up">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Research: "{item.query}"
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{item.timestamp.toLocaleString()}</span>
                      <Badge variant="outline" className="text-accent-warm border-accent-warm/30">
                        {item.results.length} sources
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-medium-surface/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="h-4 w-4 text-accent-warm" />
                    <span className="text-sm font-medium text-foreground">AI Summary</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-accent-warm" />
                    Sources Found
                  </h4>
                  <div className="space-y-3">
                    {item.results.map((result, index) => (
                      <div key={result.id}>
                        <div className="flex items-start justify-between space-x-4">
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-foreground hover:text-accent-warm transition-colors">
                              <a
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1"
                              >
                                <span>{result.title}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              {result.snippet}
                            </p>
                            <div className="flex items-center space-x-3 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {result.domain}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {result.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                        {index < item.results.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {research.length === 0 && !isSearching && (
            <Card className="glass-panel p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Ready to Research</h3>
              <p className="text-muted-foreground">
                Enter a query above to start your AI-powered web research
              </p>
            </Card>
          )}

          {isSearching && (
            <Card className="glass-panel p-8 text-center">
              <RefreshCw className="h-8 w-8 text-accent-warm mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-foreground mb-2">Searching...</h3>
              <p className="text-muted-foreground">
                AI is analyzing web sources for your query
              </p>
            </Card>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Note: Web search integration requires API setup via Supabase Edge Functions
        </div>
      </div>
    </div>
  );
};

export default ResearchPanel;