import { Button } from '../ui/button';
import Image from 'next/image';

export function MicrosoftLogin() {
  return (
    <Button variant="outline" type="button" className="w-full">
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
        alt="Microsoft Logo"
        width={16}
        height={16}
      />
      Continue with Microsoft
    </Button>
  );
}
