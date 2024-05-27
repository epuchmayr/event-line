import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CreateForm from '@/components/form/create-event/CreateForm';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';

import { EventType } from "@/types/global";

  const ADD_EVENT = gql`
  mutation Insert_events($objects: [events_insert_input!]!) {
    insert_events(objects: $objects) {
      affected_rows
    }
  }
`;

export function CreateEventDialog() {

const { user } = useUser();
const userId = user?.id.toString();
const userFullName = user?.fullName?.toString();
const router = useRouter();

const [open, setOpen] = useState(false)

const [addEvent, { data, loading, error }] = useMutation(ADD_EVENT, {
  onCompleted: (data) => {
    // console.log('event added', data);
    // router.push('/line/view');
    setOpen(false)
  },
});

const handleSubmit = (data: EventType) => {
  // event.preventDefault();
  // const formData = new FormData(event.currentTarget);
  // for (const pair of formData.entries()) {
  //   console.log(pair[0], pair[1]);
  // }
  // console.log('event', data);

  addEvent({
    variables: {
      objects: [
        {
          event_name: data.event_name,
          event_image: JSON.stringify(data.event_image, null, 2),
          event_start_date: data.event_start_date,
          //         event_end_date: data.event_end_date,
          event_range_date: JSON.stringify(data.event_range_date, null, 2),
          event_start_time: JSON.stringify(data.event_start_time, null, 2),
          event_end_time: JSON.stringify(data.event_end_time, null, 2),
          event_description: data.event_description,
          event_content: data.event_content,
          event_tags: JSON.stringify(data.event_tags, null, 2),
          event_privacy: data.event_privacy,
          user_id: userId,
          user_full_name: userFullName,
        },
      ],
    },
  });
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a moment</DialogTitle>
          <DialogDescription>
            Write a quick description of your event
          </DialogDescription>
        </DialogHeader>
        <CreateForm handleSubmit={handleSubmit}/>
        
      </DialogContent>
    </Dialog>
  )
}
