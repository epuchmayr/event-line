// types/global.d.ts

export type EventType = {
  id: string;
  event_name: string;
  event_content?: string | null;
  event_description?: string | null;
  event_image?: string | null;
  event_start_date: string;
  event_end_date?: string | null;
  event_range_date?: string | null;
  event_start_time?: string | null;
  event_end_time?: string | null;
  event_tags: string;
  event_privacy: string;
  user_id: string | null;
  user_full_name: string;
};

export type MarkerType = { name: string; position: number };
