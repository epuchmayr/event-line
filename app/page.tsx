import Link from 'next/link';

import { auth, currentUser } from '@clerk/nextjs';
import { BackgroundBeams } from '../components/ui/background-beams';

import styles from './page.module.css';

import Auth from '../components/HeaderAuth';

export default async function Home() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = auth();

  if (userId) {
    // Query DB for user specific information or display assets only to signed in users
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();
  // Use `user` to render user details or create UI elements

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>Eventline</p>
        <div>
          <Auth user={JSON.stringify(user)} userId={userId} />
        </div>
      </div>
      <BackgroundBeams />
      <div className='text-center'>Moments connect us and<br />create shared memories.</div>

      <div className={styles.grid}>
        <Link href='/sign-in' className={styles.card}>
          <h2>
            Connected <span>-&gt;</span>
          </h2>
          <p>See how your experiences connect to others.</p>
        </Link>
        <Link href='/sign-in' className={styles.card}>
          <h2>
            Personal <span>-&gt;</span>
          </h2>
          <p>
            A line taylored to your family interactions and shared memories.
          </p>
        </Link>
        <Link href='/sign-in' className={styles.card}>
          <h2>
            Recurring <span>-&gt;</span>
          </h2>
          <p>
            Create a looping line that helps measure outcomes and verify
            results.
          </p>
        </Link>
      </div>
    </main>
  );
}
