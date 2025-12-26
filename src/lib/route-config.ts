export function getPageTitle(pathname: string): string {
  // Handle exact matches first
  if (pathname === '/dashboard') return 'Dashboard';

  // Handle routes that start with specific paths
  if (pathname.startsWith('/projects')) return 'Projects';

  // Default fallback
  return 'Dashboard';
}
