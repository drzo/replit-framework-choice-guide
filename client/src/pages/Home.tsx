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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Copy, Sparkles } from "lucide-react";
import { evaluateFramework } from "../lib/framework-logic";
import { findTemplatesByType, getTemplateBoilerplate } from "../lib/templates";
import useSWR, { mutate } from "swr";

const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().min(10, "Please provide more details about your project"),
  projectType: z.enum(["web", "api", "cli", "mobile"]),
  template: z.string().optional(),
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
  const [isLoading, setIsLoading] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState(findTemplatesByType("web"));
  
  // Fetch recommendation stats
  const { data: stats, error: statsError } = useSWR('/api/recommendations/stats');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
      projectType: "web",
      template: undefined,
      requirements: {
        performance: false,
        scalability: false,
        easeOfUse: true,
        ecosystem: false
      }
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const result = evaluateFramework(data);
      let finalPrompt = result.prompt;

      // If a template was selected, append its boilerplate
      if (data.template) {
        const templateBoilerplate = getTemplateBoilerplate(data.template);
        if (templateBoilerplate) {
          finalPrompt += "\n\nTemplate specific requirements:\n" + templateBoilerplate;
        }
      }

      setRecommendation(result.recommendation);
      setPrompt(finalPrompt);

      // Save recommendation to the database
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectType: data.projectType,
          requirements: data.requirements,
          recommendedFramework: result.recommendation.split(' ')[0], // Extract framework name
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save recommendation');
      }

      // Invalidate stats cache
      mutate('/api/recommendations/stats');

      // Switch to recommendation tab after getting results
      const tabsList = document.querySelector('[value="recommendation"]');
      if (tabsList) {
        (tabsList as HTMLElement).click();
      }

      toast({
        title: "Success",
        description: "Your recommendation has been generated and saved.",
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste the prompt in Replit Agent",
    });
  };

  const handleProjectTypeChange = (type: string) => {
    form.setValue("projectType", type as "web" | "api" | "cli" | "mobile");
    setAvailableTemplates(findTemplatesByType(type));
    form.setValue("template", undefined); // Reset template when type changes
  };

  const handleTemplateSelect = (templateName: string) => {
    const template = availableTemplates.find(t => t.name === templateName);
    if (template) {
      form.setValue("requirements", template.requirements);
    }
  };

  if (statsError) {
    console.error('Failed to fetch stats:', statsError);
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Framework Choice Guide
      </h1>

      {stats && (
        <div className="mb-6 text-sm text-muted-foreground">
          <p>Total recommendations: {stats.total}</p>
          <p>Popular frameworks: {Object.entries(stats.byFramework)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 3)
            .map(([framework]) => framework)
            .join(', ')}
          </p>
        </div>
      )}

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
                      <Select
                        onValueChange={(value) => handleProjectTypeChange(value)}
                        defaultValue={field.value}
                      >
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

                {availableTemplates.length > 0 && (
                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="flex items-center gap-2">
                            Project Template
                            <Sparkles className="h-4 w-4 text-primary" />
                          </span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleTemplateSelect(value);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTemplates.map((template) => (
                              <SelectItem key={template.name} value={template.name}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          {field.value && availableTemplates.find(t => t.name === field.value)?.description}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="space-y-4">
                  <h3 className="font-medium">Project Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="requirements.performance"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            High Performance
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="requirements.scalability"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Scalability
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="requirements.easeOfUse"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Ease of Use
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="requirements.ecosystem"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Rich Ecosystem
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Get Recommendation"}
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
                      <pre className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">{prompt}</pre>
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
