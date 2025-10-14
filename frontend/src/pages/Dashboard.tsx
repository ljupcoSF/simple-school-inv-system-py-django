// import { useAuth } from '@/hooks/useAuth';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Package, FileText, ClipboardList, BarChart3, ArrowRight } from 'lucide-react';
import {useAuth} from "../hooks/useAuth.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card.tsx";
import {Button} from "../components/ui/button.tsx";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentCards = [
    {
      title: 'Browse Equipment',
      description: 'View available equipment and submit borrow requests',
      icon: Package,
      action: () => navigate('/equipment'),
      color: 'bg-primary',
    },
    {
      title: 'My Requests',
      description: 'Track your borrowing requests and returns',
      icon: FileText,
      action: () => navigate('/my-requests'),
      color: 'bg-secondary',
    },
  ];

  const adminCards = [
    {
      title: 'Equipment Catalog',
      description: 'Manage school equipment inventory',
      icon: Package,
      action: () => navigate('/equipment'),
      color: 'bg-primary',
    },
    {
      title: 'Manage Requests',
      description: 'Review and approve student requests',
      icon: ClipboardList,
      action: () => navigate('/admin-requests'),
      color: 'bg-secondary',
    },
    {
      title: 'View Reports',
      description: 'Analytics and equipment usage insights',
      icon: BarChart3,
      action: () => navigate('/reports'),
      color: 'bg-accent',
    },
  ];

  const cards = user?.role === 'admin' ? adminCards : studentCards;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-muted-foreground mt-2">
          {user?.role === 'admin'
            ? 'Manage equipment and requests from your dashboard'
            : 'Browse equipment and track your borrowing requests'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="group relative overflow-hidden shadow-card hover:shadow-hover transition-shadow cursor-pointer"
            onClick={card.action}
          >
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10">
              <card.icon className="w-full h-full" />
            </div>
            <CardHeader>
              <div className={`h-12 w-12 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="gap-2 group-hover:gap-3 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  card.action();
                }}
              >
                Go to {card.title}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Equipment</CardDescription>
            <CardTitle className="text-3xl">--</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Connect to backend to see stats</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>
              {user?.role === 'admin' ? 'Pending Requests' : 'Your Requests'}
            </CardDescription>
            <CardTitle className="text-3xl">--</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Connect to backend to see stats</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Available Items</CardDescription>
            <CardTitle className="text-3xl">--</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Connect to backend to see stats</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
