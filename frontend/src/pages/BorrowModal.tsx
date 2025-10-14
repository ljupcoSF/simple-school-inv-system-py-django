import { useState } from 'react';
// import axiosClient from '@/api/axiosClient';
// import { useToast } from '@/hooks/use-toast';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Calendar } from '@/components/ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {useToast} from "../hooks/use-toast.ts";
import axiosClient from "../api/axiosClient.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog.tsx";
import {Label} from "../components/ui/label.tsx";
import {Textarea} from "../components/ui/textarea.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "../components/ui/popover.tsx";
import {Button} from "../components/ui/button.tsx";
import {cn} from "../../lib/utils.ts";
import {Calendar} from "../components/ui/calendar.tsx";
// import { cn } from '@/lib/utils';

interface Equipment {
  id: number;
  name: string;
  description: string;
}

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  onSuccess?: () => void;
}

const BorrowModal = ({ isOpen, onClose, equipment, onSuccess }: BorrowModalProps) => {
  const [purpose, setPurpose] = useState('');
  const [returnDate, setReturnDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!purpose.trim()) {
      toast({
        title: 'Purpose required',
        description: 'Please provide a purpose for borrowing this equipment.',
        variant: 'destructive',
      });
      return;
    }

    if (!returnDate) {
      toast({
        title: 'Return date required',
        description: 'Please select an expected return date.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await axiosClient.post('/api/borrow-requests/', {
        equipment: equipment.id,
        purpose,
        expected_return_date: format(returnDate, 'yyyy-MM-dd'),
      });

      toast({
        title: 'Request submitted!',
        description: 'Your borrow request has been submitted for approval.',
      });

      setPurpose('');
      setReturnDate(undefined);
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit request:', error);
      toast({
        title: 'Request failed',
        description: 'Unable to submit request. This is a demo - connect to backend.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request to Borrow</DialogTitle>
          <DialogDescription>
            Submit a request to borrow <span className="font-medium text-foreground">{equipment.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              placeholder="Explain why you need this equipment..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Expected Return Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !returnDate && 'text-muted-foreground'
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowModal;
