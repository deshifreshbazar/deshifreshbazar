import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from '@/components/ui/loader';

interface OrderStats {
  month: string;
  year: number;
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
}

export function OrderStatsChart() {
  const [data, setData] = useState<OrderStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/stats/monthly-orders');
        if (!response.ok) {
          throw new Error('Failed to fetch order statistics');
        }
        const stats = await response.json();
        setData(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Order Statistics</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <Loader size="lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Order Statistics</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg border rounded-lg">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-blue-600">{`Total Orders: ${payload[0].value}`}</p>
          <p className="text-green-600">{`Delivered: ${payload[1].value}`}</p>
          <p className="text-orange-600">{`Pending: ${payload[2].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly Order Statistics</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(value) => `${value}`}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="totalOrders"
              name="Total Orders"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="deliveredOrders"
              name="Delivered Orders"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pendingOrders"
              name="Pending Orders"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 