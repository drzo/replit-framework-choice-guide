import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RequirementsVisualizationProps {
  requirements: {
    performance: boolean;
    scalability: boolean;
    easeOfUse: boolean;
    ecosystem: boolean;
  };
}

export function RequirementsVisualization({ requirements }: RequirementsVisualizationProps) {
  const data = [
    { requirement: 'Performance', value: requirements.performance ? 100 : 0 },
    { requirement: 'Scalability', value: requirements.scalability ? 100 : 0 },
    { requirement: 'Ease of Use', value: requirements.easeOfUse ? 100 : 0 },
    { requirement: 'Ecosystem', value: requirements.ecosystem ? 100 : 0 },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Requirements Visualization</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
              <PolarGrid stroke="hsl(var(--muted-foreground))" />
              <PolarAngleAxis 
                dataKey="requirement" 
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
              />
              <Radar
                name="Requirements"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
