import { useState } from 'react';
import { Send, Package, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { submitComplaint, ComplaintResponse } from '@/lib/api';

interface ComplaintFormProps {
  onSuccess: (response: ComplaintResponse & { complaint: string }) => void;
}

export function ComplaintForm({ onSuccess }: ComplaintFormProps) {
  const { userId } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    trackingId: '',
    pincode: '',
    complaint: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.trackingId || !form.complaint) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await submitComplaint({
        user_id: userId || 'anonymous',
        complaint: form.complaint,
        tracking_id: form.trackingId,
        pincode: form.pincode || undefined,
      });

      onSuccess({ ...response, complaint: form.complaint });
      setForm({ trackingId: '', pincode: '', complaint: '' });
      
      toast({
        title: 'Complaint Submitted',
        description: `Ticket ID: ${response.ticket_id}`,
      });
    } catch (error) {
      // Demo mode: simulate response
      const mockResponse: ComplaintResponse = {
        ticket_id: `TKT-${Date.now()}`,
        message: "Thank you for reaching out. We've analyzed your complaint and found that your package is currently in transit at the Regional Sorting Hub. Based on the tracking information, there appears to be a slight delay due to increased volume. Your package is expected to arrive within the next 2-3 business days. We apologize for any inconvenience caused and are actively monitoring your shipment.",
      };
      
      onSuccess({ ...mockResponse, complaint: form.complaint });
      setForm({ trackingId: '', pincode: '', complaint: '' });
      
      toast({
        title: 'Complaint Submitted (Demo Mode)',
        description: `Ticket ID: ${mockResponse.ticket_id}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Submit a Complaint
        </CardTitle>
        <CardDescription>
          Describe your issue and we'll analyze it using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trackingId" className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                Tracking ID *
              </Label>
              <Input
                id="trackingId"
                placeholder="Enter your tracking number"
                value={form.trackingId}
                onChange={(e) => setForm({ ...form, trackingId: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                PIN Code (Optional)
              </Label>
              <Input
                id="pincode"
                placeholder="Destination PIN code"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="complaint">Complaint Details *</Label>
            <Textarea
              id="complaint"
              placeholder="Please describe your issue in detail. Include relevant dates, expected delivery information, and any other details that might help us resolve your complaint faster."
              rows={5}
              value={form.complaint}
              onChange={(e) => setForm({ ...form, complaint: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isLoading}>
            {isLoading ? (
              <>Processing...</>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Complaint
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
