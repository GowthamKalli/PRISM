import { useState } from 'react';
import { Header } from '@/components/Header';
import { TicketTable } from './TicketTable';
import { TicketActions } from './TicketActions';
import { FeedbackList } from './FeedbackList';
import { mockTickets, mockFeedback, Ticket, Feedback } from '@/lib/api';

export function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [feedback] = useState<Feedback[]>(mockFeedback);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const handleStatusUpdate = (ticketId: string, newStatus: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.ticket_id === ticketId ? { ...t, status: newStatus } : t
      ).filter((t) => t.status !== 'CLOSED')
    );
  };

  const selectedTicketData = tickets.find((t) => t.ticket_id === selectedTicket);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TicketTable
              tickets={tickets}
              selectedTicket={selectedTicket}
              onSelectTicket={setSelectedTicket}
            />
            <FeedbackList feedback={feedback} />
          </div>
          
          <div>
            {selectedTicketData ? (
              <TicketActions
                ticketId={selectedTicketData.ticket_id}
                currentStatus={selectedTicketData.status}
                onStatusUpdate={handleStatusUpdate}
              />
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <p>Select a ticket to view actions</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
