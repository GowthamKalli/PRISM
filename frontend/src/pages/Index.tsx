import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { RoleSelector } from '@/components/RoleSelector';
import { UserDashboard } from '@/components/user/UserDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

function AppContent() {
  const { role } = useAuth();

  if (!role) {
    return <RoleSelector />;
  }

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
