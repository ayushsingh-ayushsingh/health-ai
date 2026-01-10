import { AppSidebar } from "@/components/blocks/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import {} from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "../ai-elements/loader";
import { toastManager } from "../ui/toast";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const session = authClient.useSession();

  useEffect(() => {
    if (!session.data && !session.isPending && !session.isRefetching) {
      toastManager.add({
        type: "info",
        title: "Login to access dashboard",
        description: "Redirecting to home...",
        timeout: 2500,
      });
      navigate("/");
    }
  }, [session, navigate]);

  if (session.isPending || !session.data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="floating" />
      <SidebarInset className="h-screen flex flex-col">
        <header className="flex h-14 fixed top-0 backdrop-blur-2xl bg-background/50 border-b z-10 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 mx-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {/*<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-scren flex-1 rounded-xl md:min-h-min" />
        </div>*/}
        <div className="flex-1 flex-col gap-4 px-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
