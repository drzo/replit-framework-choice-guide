import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsVisualizationProps {
  stats: {
    byFramework: Record<string, number>;
  };
}

export function StatsVisualization({ stats }: StatsVisualizationProps) {
  const data = Object.entries(stats.byFramework).map(([framework, count]) => ({
    framework,
    count,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Framework Usage Stats</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 40 }}>
              <XAxis 
                dataKey="framework" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
