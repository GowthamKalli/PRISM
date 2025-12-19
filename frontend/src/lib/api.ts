// API configuration - update BASE_URL to point to your FastAPI backend
const BASE_URL = 'http://localhost:8000';

export interface ComplaintRequest {
  user_id: string;
  complaint: string;
  tracking_id: string;
  pincode?: string;
}

export interface ComplaintResponse {
  ticket_id: string;
  message: string;
}

export interface FeedbackRequest {
  ticket_id: string;
  rating: number;
  comment?: string;
}

export interface Ticket {
  ticket_id: string;
  user_id: string;
  status: string;
  priority_level: string;
  global_rank: number;
  created_at: string;
}

export interface Feedback {
  ticket_id: string;
  source: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export async function submitComplaint(data: ComplaintRequest): Promise<ComplaintResponse> {
  const response = await fetch(`${BASE_URL}/complaint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit complaint');
  }
  
  return response.json();
}

export async function submitFeedback(data: FeedbackRequest): Promise<{ status: string }> {
  const response = await fetch(`${BASE_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit feedback');
  }
  
  return response.json();
}

// Mock data for demo purposes (when backend is not available)
export const mockTickets: Ticket[] = [
  { ticket_id: 'TKT-001', user_id: 'USR-123', status: 'IN_PROGRESS', priority_level: 'HIGH', global_rank: 1, created_at: '2024-01-15T10:30:00Z' },
  { ticket_id: 'TKT-002', user_id: 'USR-456', status: 'NEW', priority_level: 'MEDIUM', global_rank: 2, created_at: '2024-01-15T11:00:00Z' },
  { ticket_id: 'TKT-003', user_id: 'USR-789', status: 'WAITING_FOR_CONFIRMATION', priority_level: 'LOW', global_rank: 3, created_at: '2024-01-15T12:15:00Z' },
];

export const mockFeedback: Feedback[] = [
  { ticket_id: 'TKT-001', source: 'user', rating: 1, comment: 'Very helpful response!', created_at: '2024-01-15T11:00:00Z' },
  { ticket_id: 'TKT-002', source: 'admin', rating: 0, comment: 'AI response was adequate', created_at: '2024-01-15T12:00:00Z' },
];
