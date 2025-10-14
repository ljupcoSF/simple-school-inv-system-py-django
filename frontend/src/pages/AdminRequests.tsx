import { useState, useEffect } from 'react';
// import axiosClient from '@/api/axiosClient';
// import { useToast } from '@/hooks/use-toast';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, Package, User } from 'lucide-react';
import {useToast} from "../hooks/use-toast.ts";
import axiosClient from "../api/axiosClient.ts";
import {Card, CardContent, CardHeader, CardTitle} from "../components/ui/card.tsx";
import {Badge} from "../components/ui/badge.tsx";
import {Button} from "../components/ui/button.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../components/ui/tabs.tsx";

interface BorrowRequest {
  id: number;
  student: {
    id: number;
    username: string;
    email: string;
  };
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

const AdminRequests = () => {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
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
          student: { id: 1, username: 'john_doe', email: 'john@school.edu' },
          equipment: { id: 2, name: 'iPad Pro 12.9"', category: 'Tablets' },
          purpose: 'Digital art project for design class',
          status: 'pending',
          expected_return_date: '2025-10-30',
          created_at: '2025-10-14T09:00:00Z',
        },
        {
          id: 2,
          student: { id: 2, username: 'sarah_smith', email: 'sarah@school.edu' },
          equipment: { id: 1, name: 'MacBook Pro 16"', category: 'Laptops' },
          purpose: 'Final year project development',
          status: 'approved',
          expected_return_date: '2025-11-01',
          created_at: '2025-10-13T14:30:00Z',
        },
        {
          id: 3,
          student: { id: 3, username: 'mike_jones', email: 'mike@school.edu' },
          equipment: { id: 6, name: 'Blue Yeti Microphone', category: 'Audio' },
          purpose: 'Recording podcast for media class',
          status: 'return_requested',
          expected_return_date: '2025-10-20',
          created_at: '2025-10-10T11:15:00Z',
        },
        {
          id: 4,
          student: { id: 4, username: 'emily_brown', email: 'emily@school.edu' },
          equipment: { id: 4, name: 'DJI Mavic Air 2', category: 'Drones' },
          purpose: 'Campus aerial photography',
          status: 'declined',
          expected_return_date: '2025-10-25',
          created_at: '2025-10-12T16:45:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: number, newStatus: string) => {
    try {
      await axiosClient.patch(`/api/borrow-requests/${requestId}/`, {
        status: newStatus,
        actual_return_date: newStatus === 'returned' ? new Date().toISOString() : undefined,
      });

      toast({
        title: 'Status updated',
        description: `Request has been ${newStatus}.`,
      });

      fetchRequests();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Update failed',
        description: 'Unable to update request status. This is a demo.',
        variant: 'destructive',
      });
    }
  };

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-warning text-warning-foreground', icon: Clock },
    approved: { label: 'Approved', color: 'bg-success text-success-foreground', icon: CheckCircle },
    declined: { label: 'Declined', color: 'bg-destructive text-destructive-foreground', icon: XCircle },
    returned: { label: 'Returned', color: 'bg-muted text-muted-foreground', icon: Package },
    return_requested: { label: 'Return Requested', color: 'bg-secondary text-secondary-foreground', icon: Clock },
  };

  const filterByStatus = (status: string) => {
    if (status === 'all') return requests;
    return requests.filter((req) => req.status === status);
  };

  const RequestCard = ({ request }: { request: BorrowRequest }) => {
  const config = statusConfig[request.status];
  const StatusIcon = config.icon;

  const studentName = request.student?.username || 'Unknown user';
  const studentEmail = request.student?.email || 'No email';
  const equipmentName = request.equipment?.name || 'Unknown equipment';
  const equipmentCategory = request.equipment?.category || 'Uncategorized';

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{equipmentName}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{studentName}</span>
              <span>•</span>
              <span>{studentEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Badge variant="outline">{equipmentCategory}</Badge>
              <span>•</span>
              <span>
                Requested {request.created_at ? format(new Date(request.created_at), 'MMM d, yyyy') : 'N/A'}
              </span>
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
          <p className="text-sm text-muted-foreground">{request.purpose || 'No purpose provided'}</p>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Expected Return: </span>
          <span className="font-medium text-foreground">
            {request.expected_return_date
              ? format(new Date(request.expected_return_date), 'MMM d, yyyy')
              : 'N/A'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {request.status === 'pending' && (
            <>
              <Button
                onClick={() => handleUpdateStatus(request.id, 'approved')}
                size="sm"
                className="bg-success hover:bg-success/90"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                onClick={() => handleUpdateStatus(request.id, 'declined')}
                variant="destructive"
                size="sm"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </>
          )}
          {request.status === 'return_requested' && (
            <Button
              onClick={() => handleUpdateStatus(request.id, 'returned')}
              size="sm"
              variant="outline"
            >
              <Package className="h-4 w-4 mr-1" />
              Mark as Returned
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Requests</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage student borrowing requests
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="return_requested">Returns</TabsTrigger>
          <TabsTrigger value="returned">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filterByStatus(activeTab === 'all' ? 'all' : activeTab).map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
          {filterByStatus(activeTab === 'all' ? 'all' : activeTab).length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No requests in this category.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRequests;
