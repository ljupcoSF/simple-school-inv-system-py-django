// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../components/ui/card.tsx";
import {Badge} from "../components/ui/badge.tsx";
import {Button} from "../components/ui/button.tsx";

interface Equipment {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance';
  image_url?: string;
  quantity_available: number;
}

interface EquipmentCardProps {
  equipment: Equipment;
  onBorrow: () => void;
  canBorrow: boolean;
}

const EquipmentCard = ({ equipment, onBorrow, canBorrow }: EquipmentCardProps) => {
  const statusColors = {
    available: 'bg-success text-success-foreground',
    borrowed: 'bg-warning text-warning-foreground',
    maintenance: 'bg-muted text-muted-foreground',
  };

  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-hover transition-all">
      <CardHeader className="p-0">
        <div className="aspect-video bg-gradient-card flex items-center justify-center">
          {equipment.image_url ? (
            <img
              src={equipment.image_url}
              alt={equipment.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="h-16 w-16 text-muted-foreground/30" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <CardTitle className="text-lg line-clamp-1">{equipment.name}</CardTitle>
          <Badge className={statusColors[equipment.status]} variant="secondary">
            {equipment.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {equipment.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Category:</span>
          <span className="font-medium text-foreground">{equipment.category}</span>
        </div>
        {equipment.status === 'available' && (
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Available:</span>
            <span className="font-medium text-primary">{equipment.quantity_available} units</span>
          </div>
        )}
      </CardContent>
      {canBorrow && (
        <CardFooter className="p-6 pt-0">
          <Button
            onClick={onBorrow}
            disabled={equipment.status !== 'available'}
            className="w-full"
          >
            {equipment.status === 'available' ? 'Request Borrow' : 'Unavailable'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default EquipmentCard;
