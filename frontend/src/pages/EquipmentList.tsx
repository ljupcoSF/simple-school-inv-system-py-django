import { useState, useEffect } from 'react';
// import axiosClient from '@/api/axiosClient';
// import { useAuth } from '@/hooks/useAuth';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import EquipmentCard from './EquipmentCard';
import BorrowModal from './BorrowModal';
import {useAuth} from "../hooks/useAuth.ts";
import {useToast} from "../components/ui/use-toast.ts";
import axiosClient from "../api/axiosClient.ts";
import {Input} from "../components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../components/ui/select.tsx";
// import { useToast } from '@/hooks/use-toast';

interface Equipment {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance';
  image_url?: string;
  quantity_available: number;
}

const EquipmentList = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const { user } = useAuth();
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
        title: 'Error',
        description: 'Failed to load equipment. Using demo data.',
        variant: 'destructive',
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

  const handleBorrowRequest = (item: Equipment) => {
    setSelectedEquipment(item);
    setShowBorrowModal(true);
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Equipment Catalog</h1>
        <p className="text-muted-foreground mt-2">
          Browse and request available equipment
        </p>
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
          <EquipmentCard
            key={item.id}
            equipment={item}
            onBorrow={() => handleBorrowRequest(item)}
            canBorrow={user?.role === 'student'}
          />
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No equipment found matching your criteria.</p>
        </div>
      )}

      {/* Borrow Modal */}
      {selectedEquipment && (
        <BorrowModal
          isOpen={showBorrowModal}
          onClose={() => {
            setShowBorrowModal(false);
            setSelectedEquipment(null);
          }}
          equipment={selectedEquipment}
          onSuccess={fetchEquipment}
        />
      )}
    </div>
  );
};

export default EquipmentList;
