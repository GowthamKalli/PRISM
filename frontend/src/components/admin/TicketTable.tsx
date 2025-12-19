import { Clock, AlertTriangle, CheckCircle, Hourglass } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket } from '@/lib/api';

interface TicketTableProps {
  tickets: Ticket[];
  selectedTicket: string | null;
  onSelectTicket: (ticketId: string) => void;
}

const statusConfig: Record<string, { icon: React.ReactNode; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  NEW: { icon: <Clock className="h-3 w-3" />, variant: 'default' },
  IN_PROGRESS: { icon: <Hourglass className="h-3 w-3" />, variant: 'secondary' },
  WAITING_FOR_CONFIRMATION: { icon: <AlertTriangle className="h-3 w-3" />, variant: 'outline' },
  RESOLVED: { icon: <CheckCircle className="h-3 w-3" />, variant: 'secondary' },
  CLOSED: { icon: <CheckCircle className="h-3 w-3" />, variant: 'outline' },
};

const priorityColors: Record<string, string> = {
  HIGH: 'bg-destructive/10 text-destructive border-destructive/20',
  MEDIUM: 'bg-warning/10 text-warning border-warning/20',
  LOW: 'bg-success/10 text-success border-success/20',
};

export function TicketTable({ tickets, selectedTicket, onSelectTicket }: TicketTableProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="font-display">Open Tickets</CardTitle>
        <CardDescription>
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Rank</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => {
                const status = statusConfig[ticket.status] || statusConfig.NEW;
                return (
                  <TableRow
                    key={ticket.ticket_id}
                    className={`cursor-pointer transition-colors ${
                      selectedTicket === ticket.ticket_id ? 'bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => onSelectTicket(ticket.ticket_id)}
                  >
                    <TableCell className="font-mono text-sm">{ticket.ticket_id}</TableCell>
                    <TableCell className="text-muted-foreground">{ticket.user_id}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className="gap-1">
                        {status.icon}
                        {ticket.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-1 rounded border ${priorityColors[ticket.priority_level] || ''}`}>
                        {ticket.priority_level}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">#{ticket.global_rank}</TableCell>
                  </TableRow>
                );
              })}
              {tickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No open tickets
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
