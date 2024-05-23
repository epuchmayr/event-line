// TODO: see if Prisma can help with this...

export type UserType = {
  id: string; // ID of the user in our Postgres DB
  name: string; // Name of the user
  clerk_id: string; // ID of the user in Clerk; This ID should not be used on our side to associate anything with a user, use the user.id instead
};

export type EventType = {
  id: string; // ID of the event in our Postgres DB
  author_id: string; // ID of the user that created this event
  name: string; // Name of the event
  description?: string; // Description of the event
  content?: string; // Content of the event
  start_date: string; // An ISO formatted datetime that represents when event starts
  end_date?: string; // AN ISO formatted datetime that represents when event ends
  tags?: Array<string>; // An array of tag strings
  privacy: "visible" | "hidden"; // Whether the event is private (hidden) or public (visible)
  created_at: string; // An ISO formatted datetime that represents when event was created
  updated_at: string; // An ISO formatted datetime that represents when event was last updated
};
