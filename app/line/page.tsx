import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className='h-screen'>
      <Link href={'/line/create'}>Create</Link>
      <Link href={'/line/view'}>View</Link>
    </div>
  );
}
