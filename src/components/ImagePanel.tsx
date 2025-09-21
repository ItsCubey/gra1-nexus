import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download, Image as ImageIcon, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  timestamp: Date;
  model: string;
}

const ImagePanel = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedModel, setSelectedModel] = useState("gemini-pro-vision");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [quality, setQuality] = useState([80]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt, 
          model: selectedModel,
          aspectRatio,
          quality: quality[0]
        }
      });

      if (error) throw error;

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt,
        url: data.imageUrl,
        timestamp: new Date(),
        model: selectedModel
      };
      
      setImages(prev => [newImage, ...prev]);
      setPrompt("");
      
      toast({
        title: "Image Generated!",
        description: "Your AI-generated image is ready"
      });
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gra1-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Downloaded!",
        description: "Image saved to your device"
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download image",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Image Generator</h2>
          <p className="text-muted-foreground">Create stunning visuals with AI</p>
        </div>
        <Badge variant="secondary" className="bg-accent-warm/20 text-accent-warm">
          Gemini Vision
        </Badge>
      </div>

      <div className="p-6 space-y-6">
        <Card className="glass-panel p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Image Prompt
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate in detail..."
                className="bg-medium-surface border-accent-warm/30 text-primary-foreground placeholder:text-muted-foreground focus:border-accent-warm min-h-[100px]"
                disabled={isGenerating}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  AI Model
                </label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-medium-surface border-accent-warm/30 text-primary-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-pro-vision">Gemini Pro Vision</SelectItem>
                    <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                    <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Aspect Ratio
                </label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger className="bg-medium-surface border-accent-warm/30 text-primary-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                    <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                    <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                    <SelectItem value="4:3">Standard (4:3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Quality: {quality[0]}%
                </label>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={20}
                  step={10}
                  className="mt-2"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-accent-warm hover:bg-accent-warm/80 text-primary-foreground"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
        </Card>

        {images.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Generated Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="glass-panel p-4 animate-fade-in-up">
                  <div className="aspect-square relative mb-3 rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {image.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {image.model}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadImage(image.url, image.prompt)}
                        className="text-accent-warm hover:text-accent-warm/80"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {image.timestamp.toLocaleString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && !isGenerating && (
          <Card className="glass-panel p-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Images Yet</h3>
            <p className="text-muted-foreground">
              Enter a prompt above to generate your first AI image
            </p>
          </Card>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Note: Image generation requires Gemini API integration via Supabase Edge Functions
        </div>
      </div>
    </div>
  );
};

export default ImagePanel;