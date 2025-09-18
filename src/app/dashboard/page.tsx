import { auth } from '../../auth';

export default async function DashboardPage() {
  const session = await auth();
  return JSON.stringify(session);
}
