import { Circle } from 'lucide-react';
export function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <Circle className="animate-spin" />
    </div>
  );
}
