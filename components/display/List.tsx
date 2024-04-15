'use client'
import { useState } from "react";

import { Event } from '@/types/global'

export default function List({ data }: {data: {events: [Event]}}) {

  const [filterString, setFilterString] = useState('');

  return (
    <>
  {data &&
    data.events
      .filter(
        (event) =>
          event.user_full_name.toLowerCase().includes(filterString.toLowerCase()) ||
          event.event_description.toLowerCase().includes(filterString.toLowerCase())
      )
      .map((event) => {
        return (
          <div key={event.id}>
            {event.id} - {event.user_full_name} - {event.event_name}
             - {event.event_description} - {event.event_start_date}
             - {event.user_id} - {event.event_content}
             - {event.event_tags} - {event.event_privacy}
          </div>
        );
  })}
  </>
  )
}