import { useState } from 'react';
import { ComplaintForm } from './ComplaintForm';
import { ResponseCard } from './ResponseCard';
import { Header } from '@/components/Header';
import { ComplaintResponse } from '@/lib/api';

export function UserDashboard() {
  const [response, setResponse] = useState<(ComplaintResponse & { complaint: string }) | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-2xl">
        {response ? (
          <ResponseCard 
            response={response} 
            onNewComplaint={() => setResponse(null)} 
          />
        ) : (
          <ComplaintForm onSuccess={setResponse} />
        )}
      </main>
    </div>
  );
}
