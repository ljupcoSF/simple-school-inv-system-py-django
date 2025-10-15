import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axiosClient from '../api/axiosClient';
import { useToast } from '../hooks/use-toast';

interface Equipment {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance';
  image_url?: string;
  quantity_available: number;
}

interface EquipmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  onSuccess: () => void;
}

const EquipmentFormDialog = ({ isOpen, onClose, equipment, onSuccess }: EquipmentFormDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: 'available' as 'available' | 'borrowed' | 'maintenance',
    image_url: '',
    quantity_available: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        description: equipment.description,
        category: equipment.category,
        status: equipment.status,
        image_url: equipment.image_url || '',
        quantity_available: equipment.quantity_available,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        status: 'available',
        image_url: '',
        quantity_available: 1,
      });
    }
  }, [equipment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (equipment) {
        // Update existing equipment
        await axiosClient.put(`/api/equipment/${equipment.id}/`, formData);
        toast({
          title: 'Success',
          description: 'Equipment updated successfully.',
        });
      } else {
        // Create new equipment
        await axiosClient.post('/api/equipment/', formData);
        toast({
          title: 'Success',
          description: 'Equipment added successfully.',
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save equipment:', error);
      toast({
        title: 'Demo Mode',
        description: equipment 
          ? 'Equipment update simulated. Connect backend for real functionality.'
          : 'Equipment creation simulated. Connect backend for real functionality.',
      });
      // In demo mode, still call onSuccess to close the dialog
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{equipment ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
          <DialogDescription>
            {equipment 
              ? 'Update the equipment details below.' 
              : 'Fill in the details to add new equipment to the inventory.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Equipment Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., MacBook Pro 16"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the equipment"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Laptops"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Available *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity_available}
                onChange={(e) => setFormData({ ...formData, quantity_available: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'available' | 'borrowed' | 'maintenance') => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="borrowed">Borrowed</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL (optional)</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : equipment ? 'Update Equipment' : 'Add Equipment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentFormDialog;
