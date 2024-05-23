'use client';
import Image from 'next/image';
import Link from 'next/link';

import { UserButton, auth, currentUser, clerkClient } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import styles from './HeaderAuth.module.css';

function ThemeToggle() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Auth({
  user,
  userId,
}: {
  user: string;
  userId: string | null;
}) {
  if (userId) {
    return (
      <div className={styles.actions}>
        <Link href='/line'>
          <Button variant='secondary'>line-view</Button>
        </Link>

        <Link href='/'>{JSON.parse(user)?.emailAddresses[0].emailAddress}</Link>
        <UserButton afterSignOutUrl={'/'} />
        <ThemeToggle />
      </div>
    );
  } else {
    return (
      <div className={styles.actions}>
        <Link href='/sign-in'>
          <Button>Sign In</Button>
        </Link>
        <Link href='/sign-up'>
          <Button variant='secondary'>Sign Up</Button>
        </Link>
        <ThemeToggle />
      </div>
    );
  }
}
