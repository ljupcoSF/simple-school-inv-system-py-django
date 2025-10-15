import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import EquipmentFormDialog from '../components/EquipmentFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Equipment {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance';
  image_url?: string;
  quantity_available: number;
}

const AdminEquipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await axiosClient.get('/api/equipment/');
      setEquipment(response.data);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
      toast({
        title: 'Using Demo Data',
        description: 'Failed to connect to backend. Showing demo equipment.',
      });
      // Demo data fallback
      setEquipment([
        {
          id: 1,
          name: 'MacBook Pro 16"',
          description: 'High-performance laptop for design and development work',
          category: 'Laptops',
          status: 'available',
          quantity_available: 5,
        },
        {
          id: 2,
          name: 'iPad Pro 12.9"',
          description: 'Tablet for digital art and presentations',
          category: 'Tablets',
          status: 'available',
          quantity_available: 8,
        },
        {
          id: 3,
          name: 'Canon EOS R5',
          description: 'Professional camera for photography projects',
          category: 'Cameras',
          status: 'borrowed',
          quantity_available: 0,
        },
        {
          id: 4,
          name: 'DJI Mavic Air 2',
          description: 'Drone for aerial photography and videography',
          category: 'Drones',
          status: 'available',
          quantity_available: 2,
        },
        {
          id: 5,
          name: 'Wacom Cintiq Pro',
          description: 'Drawing tablet for digital illustration',
          category: 'Drawing Tablets',
          status: 'maintenance',
          quantity_available: 0,
        },
        {
          id: 6,
          name: 'Blue Yeti Microphone',
          description: 'Professional USB microphone for podcasting',
          category: 'Audio',
          status: 'available',
          quantity_available: 4,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingEquipment(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: Equipment) => {
    setEditingEquipment(item);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (item: Equipment) => {
    setEquipmentToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!equipmentToDelete) return;

    try {
      await axiosClient.delete(`/api/equipment/${equipmentToDelete.id}/`);
      toast({
        title: 'Success',
        description: 'Equipment deleted successfully.',
        variant: 'default',
      });
      fetchEquipment();
    } catch (error) {
      console.error('Failed to delete equipment:', error);
      toast({
        title: 'Demo Mode',
        description: 'Equipment deletion simulated. Connect backend for real functionality.',
      });
      // Simulate deletion in demo mode
      setEquipment(equipment.filter(item => item.id !== equipmentToDelete.id));
    } finally {
      setDeleteDialogOpen(false);
      setEquipmentToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    fetchEquipment();
    setIsFormOpen(false);
    setEditingEquipment(null);
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    available: 'bg-success text-success-foreground',
    borrowed: 'bg-warning text-warning-foreground',
    maintenance: 'bg-muted text-muted-foreground',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Equipment Management</h1>
          <p className="text-muted-foreground mt-2">
            Add, edit, and manage school equipment inventory
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="borrowed">Borrowed</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Equipment Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="group overflow-hidden shadow-card hover:shadow-hover transition-all">
            <CardHeader className="p-0">
              <div className="aspect-video bg-gradient-card flex items-center justify-center">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-16 w-16 text-muted-foreground/30" />
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-2 mb-3">
                <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                <Badge className={statusColors[item.status]} variant="secondary">
                  {item.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {item.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium text-foreground">{item.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Available:</span>
                  <span className="font-medium text-primary">{item.quantity_available} units</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 gap-2">
              <Button
                onClick={() => handleEdit(item)}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteClick(item)}
                variant="destructive"
                className="flex-1 gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No equipment found matching your criteria.</p>
        </div>
      )}

      {/* Equipment Form Dialog */}

      <EquipmentFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEquipment(null);
        }}
        equipment={editingEquipment}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{equipmentToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminEquipment;
