import { useState } from 'react';
import { Settings, ThumbsUp, ThumbsDown, Minus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface TicketActionsProps {
  ticketId: string;
  currentStatus: string;
  onStatusUpdate: (ticketId: string, newStatus: string) => void;
}

const statusOptions = [
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'WAITING_FOR_CONFIRMATION', label: 'Waiting for Confirmation' },
  { value: 'CLOSED', label: 'Closed' },
];

export function TicketActions({ ticketId, currentStatus, onStatusUpdate }: TicketActionsProps) {
  const { toast } = useToast();
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');

  const handleStatusUpdate = () => {
    onStatusUpdate(ticketId, newStatus);
    toast({
      title: 'Status Updated',
      description: `Ticket ${ticketId} is now ${newStatus.replace(/_/g, ' ')}`,
    });
  };

  const handleFeedbackSubmit = () => {
    if (feedbackRating === null) {
      toast({
        title: 'Select Rating',
        description: 'Please select a rating',
        variant: 'destructive',
      });
      return;
    }

    // In real app, this would call the API
    toast({
      title: 'Feedback Recorded',
      description: 'Admin feedback has been saved',
    });
    setFeedbackRating(null);
    setFeedbackComment('');
  };

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Status Update Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Update Status
          </CardTitle>
          <CardDescription>
            Ticket: <span className="font-mono">{ticketId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleStatusUpdate} className="w-full">
            Update Status
          </Button>
        </CardContent>
      </Card>

      {/* Admin Feedback Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            AI Response Quality
          </CardTitle>
          <CardDescription>
            Rate the AI-generated response for this ticket
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center gap-2">
            <Button
              variant={feedbackRating === 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFeedbackRating(1)}
              className="gap-1"
            >
              <ThumbsUp className="h-4 w-4" />
              Good
            </Button>
            <Button
              variant={feedbackRating === 0 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFeedbackRating(0)}
              className="gap-1"
            >
              <Minus className="h-4 w-4" />
              Neutral
            </Button>
            <Button
              variant={feedbackRating === -1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFeedbackRating(-1)}
              className="gap-1"
            >
              <ThumbsDown className="h-4 w-4" />
              Poor
            </Button>
          </div>

          <Textarea
            placeholder="Admin comment (optional)"
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            rows={3}
          />

          <Button 
            onClick={handleFeedbackSubmit} 
            variant="secondary" 
            className="w-full"
            disabled={feedbackRating === null}
          >
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
