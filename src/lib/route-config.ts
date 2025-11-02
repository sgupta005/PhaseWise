export function getPageTitle(pathname: string): string {
  // Handle exact matches first
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/settings') return 'Settings';
  if (pathname === '/profile') return 'Profile';

  // Handle routes that start with specific paths
  if (pathname.startsWith('/projects')) return 'Projects';

  // Default fallback
  return 'Dashboard';
}
