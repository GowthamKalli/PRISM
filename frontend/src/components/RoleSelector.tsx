import { User, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface RoleCardProps {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function RoleCard({ role, title, description, icon }: RoleCardProps) {
  const { login } = useAuth();

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary/50 group"
      onClick={() => login(role)}
    >
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          {icon}
        </div>
        <CardTitle className="font-display text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <span className="text-sm font-medium text-primary group-hover:underline">
          Continue as {title} →
        </span>
      </CardContent>
    </Card>
  );
}

export function RoleSelector() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="font-display text-4xl font-bold text-foreground mb-3">
          Postal Complaint System
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          AI-powered complaint resolution for faster, smarter postal services
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <RoleCard
          role="user"
          title="User"
          description="Submit and track your postal complaints"
          icon={<User className="h-8 w-8" />}
        />
        <RoleCard
          role="admin"
          title="Admin"
          description="Manage tickets and review AI responses"
          icon={<Shield className="h-8 w-8" />}
        />
      </div>
    </div>
  );
}
