'use client';

import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchProjects() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || ''
  );

  const updateSearchParam = useCallback(
    function (key: string, value: string) {
      const params = new URLSearchParams(searchParams.toString());

      if (value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearchParam('search', searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <div className="relative max-w-[200px]">
      <Input
        placeholder="Search projects..."
        className="pr-8"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}
