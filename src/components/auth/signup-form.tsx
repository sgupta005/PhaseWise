'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';

import { MicrosoftLogin } from './microsoft-login';
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/schemas/auth.schema';
import type { SignupSchema } from '@/schemas/auth.schema';
import { createAccount } from '@/actions/auth.actions';
import { useTransition } from 'react';
import { Spinner } from '../ui/spinner';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(data: SignupSchema) {
    startTransition(() => {
      createAccount(data).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else if (res.success) {
          toast.success(res.success);
          router.replace('/projects');
        }
      });
    });
  }
  return (
    <Form {...form}>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-10 items-center justify-center rounded-md">
                  <Image
                    src="/logo.svg"
                    alt="PhaseWise Logo"
                    width={100}
                    height={100}
                  />
                </div>
                <span className="sr-only">PhaseWise</span>
              </a>
              <h1 className="text-xl font-bold">
                Welcome to <span className="text-primary"> PhaseWise</span>
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@bennett.edu.in"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {isPending ? <Spinner /> : 'Create Account'}
              </Button>
            </div>
          </div>
        </form>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{' '}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </Form>
  );
}
