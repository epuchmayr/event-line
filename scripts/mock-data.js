const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "Eric Puchmayr",
    clerkId: "user_2db95hM44CF8Y6sYthrvAbKr9Ty",
  },
  {
    id: "420544b2-4001-4271-9855-fec4b6a6442a",
    name: "Jason Dippel",
    clerkId: "user_2dtJSQn4TSqDvdmnPHD8buDC3XM",
  },
];

const events = [
  {
    id: "110544b2-4001-4271-9855-fec4b6a6442a",
    authorId: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "Sample Public Event 1",
    startDate: "2024-05-23T20:09:00.968Z",
    privacy: "visible",
  },
  {
    id: "210544b2-4001-4271-9855-fec4b6a6442a",
    authorId: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "Sample Private Event 1",
    startDate: "2024-04-23T20:09:00.968Z",
    privacy: "hidden",
  },
  {
    id: "310544b2-4001-4271-9855-fec4b6a6442a",
    authorId: "420544b2-4001-4271-9855-fec4b6a6442a",
    name: "Sample Private Event 2",
    startDate: "2024-03-23T20:09:00.968Z",
    privacy: "hidden",
  },
];

module.exports = {
  users,
  events,
};
