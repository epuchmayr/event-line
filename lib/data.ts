import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { EventType } from "./dataTypes";

export const getUserEvents = async (userId: string) => {
  // Add noStore() here to prevent the response from being cached.
  noStore();

  try {
    console.log(`Fetching events for user ${userId}...`);
    const data = await sql<EventType>`
      SELECT *
      FROM events
      WHERE events.author_id = ${userId}
    `;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch event data.");
  }
};
