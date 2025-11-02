import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './layout-client';
import { SidebarProvider } from '@/contexts/sidebar-context';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </SidebarProvider>
  );
}
