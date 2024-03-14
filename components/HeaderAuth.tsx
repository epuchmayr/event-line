'use client';
import Image from 'next/image';
import Link from 'next/link';

import { UserButton, auth, currentUser, clerkClient } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import styles from './HeaderAuth.module.css';

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
        <Stack spacing={2} direction='row'>
          <Link href='/countries'>
            <Button variant='text'>countries</Button>
          </Link>
          <Link href='/line-view'>
            <Button variant='text'>line-view</Button>
          </Link>
          <Link href='/'>
          {JSON.parse(user)?.emailAddresses[0].emailAddress}
          </Link>
          <UserButton afterSignOutUrl={'/'} />
        </Stack>
      </div>
    );
  } else {
    return (
      <div className={styles.actions}>
        <Stack spacing={2} direction='row'>
          <Link href='/sign-in'>
            <Button variant='contained'>Sign In</Button>
          </Link>
          <Link href='/sign-up'>
            <Button variant='outlined'>Sign Up</Button>
          </Link>
        </Stack>
      </div>
    );
  }
}
