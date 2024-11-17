import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCcw } from "lucide-react";
import useSWR from "swr";
import { useToast } from "@/hooks/use-toast";

interface PromptHistoryProps {
  onSelectPrompt?: (prompt: PromptHistoryItem) => void;
}

interface PromptHistoryItem {
  id: number;
  projectName: string;
  projectType: string;
  description: string;
  requirements: {
    performance: boolean;
    scalability: boolean;
    easeOfUse: boolean;
    ecosystem: boolean;
  };
  prompt: string;
  recommendation: string;
  createdAt: string;
}

export function PromptHistory({ onSelectPrompt }: PromptHistoryProps) {
  const { toast } = useToast();
  const { data: history, error, isLoading, mutate } = useSWR<PromptHistoryItem[]>(
    '/api/prompts',
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err) => {
        console.error('Failed to fetch prompt history:', err);
        toast({
          title: "Error",
          description: err.info?.details || "Failed to load prompt history. Please try again.",
          variant: "destructive",
        });
      }
    }
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste the prompt in Replit Agent",
    });
  };

  const handleRetry = () => {
    mutate();
    toast({
      title: "Retrying",
      description: "Attempting to reload prompt history...",
    });
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prompt History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">Failed to load prompt history</p>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prompt History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading prompt history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!history?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prompt History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No prompts saved yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{item.projectName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(item.prompt)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {onSelectPrompt && (
                    <Button
                      variant="outline"
                      onClick={() => onSelectPrompt(item)}
                    >
                      Use Template
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm mb-2">{item.description}</p>
              <div className="text-sm text-muted-foreground">
                <strong>Type:</strong> {item.projectType}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
