import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "00:00", traffic: 20, incidents: 2 },
  { name: "04:00", traffic: 15, incidents: 1 },
  { name: "08:00", traffic: 85, incidents: 8 },
  { name: "12:00", traffic: 70, incidents: 5 },
  { name: "16:00", traffic: 90, incidents: 12 },
  { name: "20:00", traffic: 60, incidents: 4 },
  { name: "23:59", traffic: 35, incidents: 3 },
];

export const TrafficChart = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="name" 
            className="text-muted-foreground text-xs"
          />
          <YAxis className="text-muted-foreground text-xs" />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px"
            }}
          />
          <Line 
            type="monotone" 
            dataKey="traffic" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            name="Traffic Volume (%)"
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="incidents" 
            stroke="hsl(var(--danger))" 
            strokeWidth={2}
            name="Active Incidents"
            dot={{ fill: "hsl(var(--danger))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};