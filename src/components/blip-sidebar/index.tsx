import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import { BlipTextarea } from "./blip-textarea";
import { BlipMessage } from "./blip-message";

const messages = [
  {
    user: {
      fullName: "JB Portals",
      imageUrl: "https://github.com/JBPORTALS.png",
    },
    content: "Hello guys hope you have completed the given work",
    createdAt: "23/08/2025, 10:14 AM",
  },
  {
    user: {
      fullName: "Akash",
      imageUrl: "https://github.com/akash.png",
    },
    content: "Sir our team is still working on some changes",
    createdAt: "23/08/2025, 10:15 AM",
  },
  {
    user: {
      fullName: "JB Portals",
      imageUrl: "https://github.com/JBPORTALS.png",
    },
    content: "Ok Akash",
    createdAt: "23/08/2025, 10:16 AM",
  },
  {
    user: {
      fullName: "Priya",
      imageUrl: "https://github.com/priya.png",
    },
    content: "I have completed the design mockups and uploaded them to Figma",
    createdAt: "23/08/2025, 10:17 AM",
  },
  {
    user: {
      fullName: "Akash",
      imageUrl: "https://github.com/akash.png",
    },
    content: "Thanks Priya, I will check and integrate them",
    createdAt: "23/08/2025, 10:18 AM",
  },
  {
    user: {
      fullName: "Rahul",
      imageUrl: "https://github.com/rahul.png",
    },
    content: "Backend APIs are ready for testing",
    createdAt: "23/08/2025, 10:19 AM",
  },
  {
    user: {
      fullName: "Sneha",
      imageUrl: "https://github.com/sneha.png",
    },
    content: "I’m still fixing the mobile responsiveness",
    createdAt: "23/08/2025, 10:21 AM",
  },
  {
    user: {
      fullName: "JB Portals",
      imageUrl: "https://github.com/JBPORTALS.png",
    },
    content: "Great progress everyone, keep me updated",
    createdAt: "23/08/2025, 10:22 AM",
  },
  {
    user: {
      fullName: "Akash",
      imageUrl: "https://github.com/akash.png",
    },
    content: "Sir, do we need to prepare a demo for tomorrow?",
    createdAt: "23/08/2025, 10:23 AM",
  },
  {
    user: {
      fullName: "JB Portals",
      imageUrl: "https://github.com/JBPORTALS.png",
    },
    content: "Yes, we will have a demo tomorrow morning",
    createdAt: "23/08/2025, 10:24 AM",
  },
  {
    user: {
      fullName: "Priya",
      imageUrl: "https://github.com/priya.png",
    },
    content: "I’ll prepare the slides for the demo",
    createdAt: "23/08/2025, 10:25 AM",
  },
  {
    user: {
      fullName: "Rahul",
      imageUrl: "https://github.com/rahul.png",
    },
    content: "I’ll ensure the APIs are stable before the demo",
    createdAt: "23/08/2025, 10:26 AM",
  },
  {
    user: {
      fullName: "Sneha",
      imageUrl: "https://github.com/sneha.png",
    },
    content: "I’ll double-check the styles today",
    createdAt: "23/08/2025, 10:27 AM",
  },
  {
    user: {
      fullName: "Akash",
      imageUrl: "https://github.com/akash.png",
    },
    content: "Can someone help me with the login UI issue?",
    createdAt: "23/08/2025, 10:28 AM",
  },
  {
    user: {
      fullName: "Priya",
      imageUrl: "https://github.com/priya.png",
    },
    content: "Yes Akash, I’ll join your call in 10 mins",
    createdAt: "23/08/2025, 10:29 AM",
  },
  {
    user: {
      fullName: "JB Portals",
      imageUrl: "https://github.com/JBPORTALS.png",
    },
    content: "Remember guys, focus on quality, not just speed",
    createdAt: "23/08/2025, 10:30 AM",
  },
  {
    user: {
      fullName: "Rahul",
      imageUrl: "https://github.com/rahul.png",
    },
    content: "Noted sir",
    createdAt: "23/08/2025, 10:31 AM",
  },
  {
    user: {
      fullName: "Sneha",
      imageUrl: "https://github.com/sneha.png",
    },
    content: "Yes sir 👍",
    createdAt: "23/08/2025, 10:31 AM",
  },
  {
    user: {
      fullName: "Akash",
      imageUrl: "https://github.com/akash.png",
    },
    content: "Thanks Priya, login UI is working fine now",
    createdAt: "23/08/2025, 10:33 AM",
  },
  {
    user: {
      fullName: "Priya",
      imageUrl: "https://github.com/priya.png",
    },
    content: "Great! Let’s finish the rest before EOD",
    createdAt: "23/08/2025, 10:34 AM",
  },
];

export function BlipSidebar() {
  return (
    <Sidebar
      collapsible="none"
      className="bg-background sticky top-0 hidden h-svh w-[500px] border-l lg:flex"
    >
      <SidebarHeader className="h-12 border-b px-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Blip</span>
          <Button size={"xs"} variant={"ghost"}>
            <SearchIcon />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col-reverse gap-4 px-4 py-4">
        {messages.map((message, i) => (
          <BlipMessage key={i} message={message} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <BlipTextarea />
      </SidebarFooter>
    </Sidebar>
  );
}
