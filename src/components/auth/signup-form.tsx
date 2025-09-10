import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';

import { MicrosoftLogin } from './microsoft-login';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-10 items-center justify-center rounded-md">
                <Image
                  src="/logo.svg"
                  alt="Mentra BU Logo"
                  width={100}
                  height={100}
                />
              </div>
              <span className="sr-only">Mentra BU</span>
            </a>
            <h1 className="text-xl font-bold">
              Welcome to <span className="text-primary"> Mentra BU</span>
            </h1>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </div>

          <MicrosoftLogin />
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Full Name</Label>
            <Input id="fullName" type="text" placeholder="John Doe" required />
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@bennett.edu.in"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Password</Label>
              <Input id="email" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
