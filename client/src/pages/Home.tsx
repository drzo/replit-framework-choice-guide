import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Copy } from "lucide-react";
import { evaluateFramework } from "../lib/framework-logic";

const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().min(10, "Please provide more details about your project"),
  projectType: z.enum(["web", "api", "cli", "mobile"]),
  requirements: z.object({
    performance: z.boolean().default(false),
    scalability: z.boolean().default(false),
    easeOfUse: z.boolean().default(false),
    ecosystem: z.boolean().default(false)
  })
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const { toast } = useToast();
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
      projectType: "web",
      requirements: {
        performance: false,
        scalability: false,
        easeOfUse: true,
        ecosystem: false
      }
    }
  });

  const onSubmit = async (data: FormData) => {
    const result = evaluateFramework(data);
    setRecommendation(result.recommendation);
    setPrompt(result.prompt);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste the prompt in Replit Agent",
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Framework Choice Guide
      </h1>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Project Details</TabsTrigger>
          <TabsTrigger value="recommendation" disabled={!recommendation}>
            Recommendation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My awesome project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your project and its requirements..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="web">Web Application</SelectItem>
                          <SelectItem value="api">API Service</SelectItem>
                          <SelectItem value="cli">CLI Tool</SelectItem>
                          <SelectItem value="mobile">Mobile App</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Get Recommendation
                </Button>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="recommendation">
          {recommendation && (
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Recommended Framework</h3>
                  <p className="text-gray-600">{recommendation}</p>
                </div>

                {prompt && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Replit Agent Prompt</h3>
                    <div className="relative">
                      <pre className="bg-gray-100 p-4 rounded-lg">{prompt}</pre>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(prompt)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
