import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsChartsProps {
  dashboardData?: any;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ dashboardData }) => {
  // Mock data for charts (in production, this would come from API)
  const visitorData = [
    { name: '22/08', visits: 45, leads: 8 },
    { name: '23/08', visits: 52, leads: 12 },
    { name: '24/08', visits: 48, leads: 9 },
    { name: '25/08', visits: 61, leads: 15 },
    { name: '26/08', visits: 73, leads: 18 },
    { name: '27/08', visits: 67, leads: 14 },
    { name: 'Today', visits: 84, leads: 22 }
  ];

  const planDistribution = [
    { name: 'Basic', value: 35, color: '#8B5CF6' },
    { name: 'Premium', value: 55, color: '#3B82F6' },
    { name: 'Enterprise', value: 10, color: '#10B981' }
  ];

  const conversionFunnel = [
    { stage: 'Visitors', count: 420, percentage: 100 },
    { stage: 'Form Views', count: 250, percentage: 60 },
    { stage: 'Form Starts', count: 180, percentage: 43 },
    { stage: 'Form Submits', count: 89, percentage: 21 },
    { stage: 'Qualified Leads', count: 76, percentage: 18 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Visitor & Leads Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Visitor & Lead Trends (7 days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="visits" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Visits"
              />
              <Line 
                type="monotone" 
                dataKey="leads" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Leads"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Plan Selection Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={planDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔽 Conversion Funnel Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionFunnel} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={100} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} people (${conversionFunnel.find(item => item.count === value)?.percentage}%)`,
                  'Count'
                ]}
              />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;
