import { v4 as uuid } from "uuid";

export const TodosSeed = [
  {
    id: uuid(),
    text: "Develop the To-do list page",
    hasCompleted: false,
    user_id: null,
    order: 1,
  },
  {
    id: uuid(),
    text: "Create the drag-and-drop function",
    hasCompleted: false,
    user_id: null,
    order: 2,
  },
  {
    id: uuid(),
    text: "Add new tasks",
    hasCompleted: false,
    user_id: null,
    order: 3,
  },
  {
    id: uuid(),
    text: "Delete itens",
    hasCompleted: false,
    user_id: null,
    order: 4,
  },
  {
    id: uuid(),
    text: "Erase all",
    hasCompleted: false,
    user_id: null,
    order: 5,
  },
  {
    id: uuid(),
    text: "Checked item goes to Done list",
    hasCompleted: false,
    user_id: null,
    order: 6,
  },
  {
    id: uuid(),
    text: "This item label may be edited",
    hasCompleted: false,
    user_id: null,
    order: 7,
  },
  {
    id: uuid(),
    text: "Get FTP credentials",
    hasCompleted: true,
    user_id: null,
    order: 1,
  },
  {
    id: uuid(),
    text: "Home Page Design",
    hasCompleted: true,
    user_id: null,
    order: 2,
  },
  {
    id: uuid(),
    text: "E-mail John about the deadline",
    hasCompleted: true,
    user_id: null,
    order: 3,
  },
  {
    id: uuid(),
    text: "Create a Google Driver folder",
    hasCompleted: true,
    user_id: null,
    order: 4,
  },
  {
    id: uuid(),
    text: "Send a gift to the client",
    hasCompleted: true,
    user_id: null,
    order: 5,
  },
];
