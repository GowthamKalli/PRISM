import { useState } from 'react';
import { Bot, ThumbsUp, ThumbsDown, Minus, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { submitFeedback, ComplaintResponse } from '@/lib/api';

interface ResponseCardProps {
  response: ComplaintResponse & { complaint: string };
  onNewComplaint: () => void;
}

export function ResponseCard({ response, onNewComplaint }: ResponseCardProps) {
  const { toast } = useToast();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async () => {
    if (selectedRating === null) {
      toast({
        title: 'Select Rating',
        description: 'Please select a rating before submitting',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFeedback({
        ticket_id: response.ticket_id,
        rating: selectedRating,
        comment: comment || undefined,
      });
      setFeedbackSubmitted(true);
      toast({
        title: 'Thank You!',
        description: 'Your feedback helps us improve',
      });
    } catch {
      // Demo mode
      setFeedbackSubmitted(true);
      toast({
        title: 'Thank You! (Demo)',
        description: 'Your feedback has been recorded',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* AI Response Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-display text-lg">AI Response</CardTitle>
                <CardDescription>Ticket: {response.ticket_id}</CardDescription>
              </div>
            </div>
            <Badge variant="secondary">Automated</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-card p-4 border">
            <p className="text-sm text-muted-foreground mb-2">Your complaint:</p>
            <p className="text-sm italic">"{response.complaint}"</p>
          </div>
          
          <div className="rounded-lg bg-card p-4 border border-primary/20">
            <p className="text-foreground leading-relaxed">{response.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Rate This Response
          </CardTitle>
          <CardDescription>
            Help us improve our AI by providing feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedbackSubmitted ? (
            <div className="text-center py-6 animate-fade-in">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="font-medium text-foreground">Feedback Submitted!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Thank you for helping us improve
              </p>
              <Button onClick={onNewComplaint} className="mt-4">
                Submit Another Complaint
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center gap-3">
                <Button
                  variant={selectedRating === 1 ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setSelectedRating(1)}
                  className="flex-1 max-w-32 gap-2"
                >
                  <ThumbsUp className="h-5 w-5" />
                  Good
                </Button>
                <Button
                  variant={selectedRating === 0 ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setSelectedRating(0)}
                  className="flex-1 max-w-32 gap-2"
                >
                  <Minus className="h-5 w-5" />
                  Okay
                </Button>
                <Button
                  variant={selectedRating === -1 ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setSelectedRating(-1)}
                  className="flex-1 max-w-32 gap-2"
                >
                  <ThumbsDown className="h-5 w-5" />
                  Poor
                </Button>
              </div>

              <Textarea
                placeholder="Additional comments (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />

              <div className="flex gap-3">
                <Button
                  onClick={handleFeedback}
                  disabled={isSubmitting || selectedRating === null}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
                <Button variant="outline" onClick={onNewComplaint}>
                  New Complaint
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
