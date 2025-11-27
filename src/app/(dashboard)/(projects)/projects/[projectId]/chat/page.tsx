import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { verifyProjectAccess } from '@/db/project.db';
import ChatContainer from '@/components/chat/ChatContainer';

export default async function ChatPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const { projectId } = await params;

  const hasAccess = await verifyProjectAccess(projectId);
  if (!hasAccess) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] px-6 py-4 max-w-5xl mx-auto">
      <main className="flex-1 min-h-0">
        <ChatContainer projectId={projectId} />
      </main>
    </div>
  );
}
