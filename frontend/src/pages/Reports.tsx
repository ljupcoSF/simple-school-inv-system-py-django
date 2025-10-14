import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface EquipmentUsageData {
  equipment_name: string;
  total_borrows: number;
  category: string;
}

interface UserActivityData {
  student_name: string;
  total_requests: number;
  approved_requests: number;
}

const Reports = () => {
  const [equipmentData, setEquipmentData] = useState<EquipmentUsageData[]>([]);
  const [userActivityData, setUserActivityData] = useState<UserActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [equipmentResponse, userResponse] = await Promise.all([
        axiosClient.get('/api/reports/equipment-usage/'),
        axiosClient.get('/api/reports/user-activity/'),
      ]);

      setEquipmentData(equipmentResponse.data);
      setUserActivityData(userResponse.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      // Demo data fallback
      setEquipmentData([
        { equipment_name: 'MacBook Pro', total_borrows: 24, category: 'Laptops' },
        { equipment_name: 'iPad Pro', total_borrows: 18, category: 'Tablets' },
        { equipment_name: 'Canon EOS R5', total_borrows: 15, category: 'Cameras' },
        { equipment_name: 'DJI Mavic Air', total_borrows: 12, category: 'Drones' },
        { equipment_name: 'Blue Yeti Mic', total_borrows: 20, category: 'Audio' },
        { equipment_name: 'Wacom Cintiq', total_borrows: 10, category: 'Tablets' },
      ]);

      setUserActivityData([
        { student_name: 'John Doe', total_requests: 8, approved_requests: 7 },
        { student_name: 'Sarah Smith', total_requests: 6, approved_requests: 6 },
        { student_name: 'Mike Jones', total_requests: 5, approved_requests: 4 },
        { student_name: 'Emily Brown', total_requests: 7, approved_requests: 5 },
        { student_name: 'Alex Wilson', total_requests: 4, approved_requests: 4 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) => headers.map((header) => row[header]).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: `${filename} has been exported to CSV.`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-2">
            Equipment usage and student activity insights
          </p>
        </div>
        <TrendingUp className="h-8 w-8 text-primary" />
      </div>

      {/* Equipment Usage Report */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Equipment Usage</CardTitle>
              <CardDescription>Total borrows by equipment type</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(equipmentData, 'equipment_usage')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={equipmentData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="equipment_name"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar
                dataKey="total_borrows"
                fill="hsl(var(--primary))"
                name="Total Borrows"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Activity Report */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Activity</CardTitle>
              <CardDescription>Request statistics by student</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(userActivityData, 'user_activity')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="student_name"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar
                dataKey="total_requests"
                fill="hsl(var(--secondary))"
                name="Total Requests"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="approved_requests"
                fill="hsl(var(--success))"
                name="Approved Requests"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Most Borrowed</CardDescription>
            <CardTitle className="text-2xl">
              {equipmentData.length > 0 ? equipmentData[0].equipment_name : 'N/A'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {equipmentData.length > 0 ? `${equipmentData[0].total_borrows} times` : 'No data'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Most Active Student</CardDescription>
            <CardTitle className="text-2xl">
              {userActivityData.length > 0 ? userActivityData[0].student_name : 'N/A'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {userActivityData.length > 0 ? `${userActivityData[0].total_requests} requests` : 'No data'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Approval Rate</CardDescription>
            <CardTitle className="text-2xl">
              {userActivityData.length > 0
                ? `${Math.round(
                    (userActivityData.reduce((acc, user) => acc + user.approved_requests, 0) /
                      userActivityData.reduce((acc, user) => acc + user.total_requests, 0)) *
                      100
                  )}%`
                : 'N/A'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Overall approval rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
