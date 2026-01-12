"use client";

import * as React from "react";
import {
  AudioWaveform,
  // Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  // Map,
  PieChart,
  SquareTerminal,
  // BookOpen,
  // Settings2,
} from "lucide-react";

// import { NavMain } from "@/components/blocks/nav-main";
// import { NavProjects } from "@/components/blocks/nav-projects";
import { NavUser } from "@/components/blocks/nav-user";
import { TeamSwitcher } from "@/components/blocks/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { ChatHistory } from "./chat-history";

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Chat",
          url: "/dashboard",
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
        },
      ],
    },
    // {
    //   title: "Chat",
    //   url: "/dashboard",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "/chat",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = authClient.useSession();
  const user = {
    name: session.data?.user.name || "User",
    avatar: session.data?.user.image || "X",
    email: session.data?.user.email || "user@example.com",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/*<NavMain items={data.navMain} />*/}
        <ChatHistory />
        {/*<NavProjects projects={data.projects} />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
