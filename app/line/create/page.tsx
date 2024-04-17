'use client';
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';

import { gql, useMutation } from '@apollo/client';
import CreateForm from '@/components/form/create-event/CreateForm';
import { useRouter } from 'next/navigation';

const ADD_EVENT = gql`
  mutation Insert_events($objects: [events_insert_input!]!) {
    insert_events(objects: $objects) {
      affected_rows
    }
  }
`;

export default function Page() {
  const { user } = useUser();
  const userId = user?.id.toString();
  const userFullName = user?.fullName?.toString();
  const router = useRouter();

  const [addEvent, { data, loading, error }] = useMutation(ADD_EVENT, {
    onCompleted: (data) => {
      console.log('event added', data);
      router.push('/line/view');
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    console.log('event', event, event.currentTarget, formData.entries());

    // addEvent({
    //   variables: {
    //     objects: [
    //       {
    //         event_name: formData.get('event_name') as string,
    //         event_start_date: formData.get('event_start_date') as string,
    //         event_end_date: formData.get('event_end_date') as string,
    //         event_start_time: formData.get('event_start_time') as string,
    //         event_end_time: formData.get('event_end_time') as string,
    //         event_description: formData.get('event_description') as string,
    //         event_content: formData.get('event_content') as string,
    //         event_tags: formData.get('event_tags') as string,
    //         event_privacy: formData.get('event_privacy') as string,
    //         user_id: userId,
    //         user_full_name: userFullName,
    //       },
    //     ],
    //   },
    // });
  };

  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;

  return (
    <div className='h-screen flex justify-center items-center'>
      <CreateForm handleSubmit={handleSubmit} />
    </div>
  );
}
