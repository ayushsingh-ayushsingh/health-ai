import { Bot, ChevronRight, Plus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BASE_URL, CLIENT_URL } from "@/lib/auth-client";

export interface Conversation {
  title: string;
  _id: string;
  userId: string;
  llmModel: string;
  messageCount: number;
  tokenCount: number;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
}

const getConversations = async () => {
  const res = await fetch(BASE_URL + "/api/conversations", {
    credentials: "include",
  });
  const conversations = await res.json();

  return conversations;
};

export function ChatHistory() {
  const { data } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Health AI</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuButton tooltip={"ChatBot"} asChild>
          <Link to="/dashboard">
            <Plus />
            <span>New Chat</span>
          </Link>
        </SidebarMenuButton>
        <Collapsible defaultOpen={false} className="group/collapsible" asChild>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"ChatBot"}>
                <Bot />
                <span>Chats</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {data &&
                  data.map((convo: Conversation, pos: number) => (
                    <SidebarMenuSubItem key={convo.title + pos}>
                      <SidebarMenuSubButton asChild>
                        <Link to={CLIENT_URL + "/dashboard/chat/" + convo._id}>
                          <span>{convo.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
