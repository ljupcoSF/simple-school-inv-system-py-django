import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useToast } from '../hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, Package } from 'lucide-react';

interface BorrowRequest {
  id: number;
  equipment: {
    id: number;
    name: string;
    category: string;
  };
  purpose: string;
  status: 'pending' | 'approved' | 'declined' | 'returned' | 'return_requested';
  expected_return_date: string;
  actual_return_date?: string;
  created_at: string;
}

const MyRequests = () => {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosClient.get('/api/borrow-requests/');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      // Demo data fallback
      setRequests([
        {
          id: 1,
          equipment: { id: 1, name: 'MacBook Pro 16"', category: 'Laptops' },
          purpose: 'Final year project development',
          status: 'approved',
          expected_return_date: '2025-11-01',
          created_at: '2025-10-15T10:00:00Z',
        },
        {
          id: 2,
          equipment: { id: 4, name: 'DJI Mavic Air 2', category: 'Drones' },
          purpose: 'Campus aerial photography for yearbook',
          status: 'pending',
          expected_return_date: '2025-10-25',
          created_at: '2025-10-14T14:30:00Z',
        },
        {
          id: 3,
          equipment: { id: 6, name: 'Blue Yeti Microphone', category: 'Audio' },
          purpose: 'Recording podcast for media class',
          status: 'return_requested',
          expected_return_date: '2025-10-20',
          created_at: '2025-10-10T09:15:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReturn = async (requestId: number) => {
    try {
      await axiosClient.patch(`/api/borrow-requests/${requestId}/`, {
        status: 'return_requested',
      });

      toast({
        title: 'Return requested',
        description: 'Your return request has been submitted.',
      });

      fetchRequests();
    } catch (error) {
      console.error('Failed to request return:', error);
      toast({
        title: 'Request failed',
        description: 'Unable to submit return request. This is a demo.',
        variant: 'destructive',
      });
    }
  };

  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'bg-warning text-warning-foreground',
      icon: Clock,
    },
    approved: {
      label: 'Approved',
      color: 'bg-success text-success-foreground',
      icon: CheckCircle,
    },
    declined: {
      label: 'Declined',
      color: 'bg-destructive text-destructive-foreground',
      icon: XCircle,
    },
    returned: {
      label: 'Returned',
      color: 'bg-muted text-muted-foreground',
      icon: Package,
    },
    return_requested: {
      label: 'Return Requested',
      color: 'bg-secondary text-secondary-foreground',
      icon: Clock,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Requests</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage your equipment borrowing requests
        </p>
      </div>

      <div className="space-y-4">
        {requests.map((request) => {
          const config = statusConfig[request.status];
          const StatusIcon = config.icon;

          return (
            <Card key={request.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{request.equipment.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{request.equipment.category}</Badge>
                      <span>•</span>
                      <span>Requested {format(new Date(request.created_at), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  <Badge className={config.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Purpose:</p>
                  <p className="text-sm text-muted-foreground">{request.purpose}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Expected Return: </span>
                    <span className="font-medium text-foreground">
                      {format(new Date(request.expected_return_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {request.actual_return_date && (
                    <div>
                      <span className="text-muted-foreground">Returned: </span>
                      <span className="font-medium text-foreground">
                        {format(new Date(request.actual_return_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
                {request.status === 'approved' && (
                  <Button
                    variant="outline"
                    onClick={() => handleRequestReturn(request.id)}
                  >
                    Request Return
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">You haven't made any requests yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
