import { ThumbsUp, ThumbsDown, Minus, User, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Feedback } from '@/lib/api';

interface FeedbackListProps {
  feedback: Feedback[];
}

const ratingIcons: Record<number, { icon: React.ReactNode; label: string; color: string }> = {
  1: { icon: <ThumbsUp className="h-4 w-4" />, label: 'Good', color: 'text-success' },
  0: { icon: <Minus className="h-4 w-4" />, label: 'Neutral', color: 'text-muted-foreground' },
  '-1': { icon: <ThumbsDown className="h-4 w-4" />, label: 'Poor', color: 'text-destructive' },
};

export function FeedbackList({ feedback }: FeedbackListProps) {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <CardHeader>
        <CardTitle className="font-display">Recent Feedback</CardTitle>
        <CardDescription>
          Latest AI response ratings from users and admins
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {feedback.map((item, index) => {
            const rating = ratingIcons[item.rating] || ratingIcons[0];
            return (
              <div
                key={`${item.ticket_id}-${index}`}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className={`mt-0.5 ${rating.color}`}>
                  {rating.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm">{item.ticket_id}</span>
                    <Badge variant="outline" className="text-xs gap-1">
                      {item.source === 'admin' ? (
                        <Shield className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      {item.source}
                    </Badge>
                  </div>
                  {item.comment && (
                    <p className="text-sm text-muted-foreground truncate">
                      {item.comment}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
          {feedback.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">
              No feedback recorded yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
