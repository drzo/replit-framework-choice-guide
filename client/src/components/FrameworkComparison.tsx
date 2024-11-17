import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const frameworks = {
  web: {
    react: {
      name: "React",
      description: "A JavaScript library for building user interfaces",
      strengths: ["ecosystem", "performance"],
      features: {
        componentBased: true,
        virtualDOM: true,
        SSR: false,
        staticTyping: false,
        builtInRouting: false,
        stateManagement: "External libraries",
      }
    },
    vue: {
      name: "Vue.js",
      description: "The Progressive JavaScript Framework",
      strengths: ["easeOfUse", "ecosystem"],
      features: {
        componentBased: true,
        virtualDOM: true,
        SSR: true,
        staticTyping: true,
        builtInRouting: true,
        stateManagement: "Vuex built-in",
      }
    },
    next: {
      name: "Next.js",
      description: "The React Framework for Production",
      strengths: ["performance", "scalability"],
      features: {
        componentBased: true,
        virtualDOM: true,
        SSR: true,
        staticTyping: true,
        builtInRouting: true,
        stateManagement: "External libraries",
      }
    },
  },
  api: {
    express: {
      name: "Express.js",
      description: "Fast, unopinionated, minimalist web framework for Node.js",
      strengths: ["ecosystem", "easeOfUse"],
      features: {
        middleware: true,
        routing: true,
        templateEngine: true,
        orm: false,
        validation: false,
        authentication: "External libraries",
      }
    },
    fastify: {
      name: "Fastify",
      description: "Fast and low overhead web framework for Node.js",
      strengths: ["performance", "scalability"],
      features: {
        middleware: true,
        routing: true,
        templateEngine: true,
        orm: false,
        validation: true,
        authentication: "External plugins",
      }
    },
  },
};

interface FrameworkComparisonProps {
  projectType: "web" | "api";
}

export function FrameworkComparison({ projectType }: FrameworkComparisonProps) {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const availableFrameworks = Object.entries(frameworks[projectType]);

  const handleFrameworkSelect = (index: number, value: string) => {
    const newSelected = [...selectedFrameworks];
    newSelected[index] = value;
    setSelectedFrameworks(newSelected);
  };

  // Get feature keys based on project type
  const getFeatureKeys = () => {
    if (selectedFrameworks.length === 0) return [];
    const firstFramework = frameworks[projectType][selectedFrameworks[0]];
    return Object.keys(firstFramework.features);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Framework Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          {[0, 1].map((index) => (
            <Select
              key={index}
              value={selectedFrameworks[index]}
              onValueChange={(value) => handleFrameworkSelect(index, value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                {availableFrameworks.map(([key, framework]) => (
                  <SelectItem key={key} value={key}>
                    {framework.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {selectedFrameworks.length === 2 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                {selectedFrameworks.map((fw) => (
                  <TableHead key={`header-${fw}`}>{frameworks[projectType][fw].name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow key="description-row">
                <TableCell className="font-medium">Description</TableCell>
                {selectedFrameworks.map((fw) => (
                  <TableCell key={`description-${fw}`}>{frameworks[projectType][fw].description}</TableCell>
                ))}
              </TableRow>
              <TableRow key="strengths-row">
                <TableCell className="font-medium">Key Strengths</TableCell>
                {selectedFrameworks.map((fw) => (
                  <TableCell key={`strengths-${fw}`}>
                    {frameworks[projectType][fw].strengths.join(", ")}
                  </TableCell>
                ))}
              </TableRow>
              {getFeatureKeys().map((feature) => (
                <TableRow key={`feature-${feature}`}>
                  <TableCell className="font-medium">
                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                  </TableCell>
                  {selectedFrameworks.map((fw) => (
                    <TableCell key={`${fw}-${feature}`}>
                      {typeof frameworks[projectType][fw].features[feature] === 'boolean'
                        ? frameworks[projectType][fw].features[feature] ? '✓' : '✗'
                        : frameworks[projectType][fw].features[feature]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
