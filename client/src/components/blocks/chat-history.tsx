import { Bot, ChevronRight, EllipsisVertical, Plus } from "lucide-react";

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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/components/ui/menu";
import { getConversations, handleDelete } from "@/lib/queryFunctions";

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
              {data &&
                data.map((convo: Conversation, pos: number) => (
                  <div className="w-full">
                    <SidebarMenuSubItem
                      key={convo.title + pos}
                      className="flex items-center"
                    >
                      <SidebarMenuSubButton
                        asChild
                        className="flex-1 p-0 mr-0.5"
                      >
                        <Link
                          to={"/dashboard/chat/" + convo._id}
                          className="flex justify-between p-0"
                        >
                          <span className="pl-3 truncate text-ellipsis">
                            {convo.title[0].toUpperCase()}
                            {convo.title.slice(1)}
                          </span>
                          <ConversationMenu conversationId={convo._id} />
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </div>
                ))}
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function ConversationMenu({
  conversationId,
}: {
  conversationId: string;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      navigate("/dashboard");
    },
  });

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button size={"xs"} variant={"ghost"} onClick={() => {}}>
            <EllipsisVertical />
          </Button>
        }
      />
      <MenuPopup align="start" sideOffset={4}>
        <MenuItem>Rename</MenuItem>
        <MenuItem onClick={() => deleteMutation.mutate(conversationId)}>
          Delete
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
}
