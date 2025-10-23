"use client"

import * as React from "react"
import {
  IconDashboard,
  IconDatabase,
  IconSettings,
} from "@tabler/icons-react"
import Image from "next/image";

import { NavDocuments } from "@/components/nav-documents"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TUser } from "@/app/types/user";
import { logout } from "@/app/api/logout";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

const data = {
  documents: [
    {
      name: "Dashboard",
      url: "/workspace/usher",
      icon: IconDashboard,
    },
    {
      name: "All attendance",
      url: "/workspace/usher/attendance",
      icon: IconDatabase,
    },
    {
      name: "Create attendance",
      url: "/workspace/usher/attendance/create",
      icon: IconDatabase,
    },
  ],
}
export function AppSidebar({
  user,
  ...props
}: { user: TUser } & React.ComponentProps<typeof Sidebar>) {
  const userdata = {
    name: user.firstName ? user.firstName : "DLCF User",
    email: user.email ? user.email : "",
    avatar: "/avatars/shadcn.jpg",
  };

  const logoutSide = async ()=>{
    await logout();
    redirect("/login");
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image
                  src="/dlcfOAU.jpeg"
                  alt="DLCF Logo"
                  width={50}
                  height={50}
                  className="mx-auto mt-4"
                />
                <span className="text-base font-semibold">DLCF OAU</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavDocuments items={data.documents} />

    <form action={logoutSide}>
      <Button className="bg-red-400 w-full text-white" type="submit">Logout</Button>
    </form>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userdata} />
      </SidebarFooter>
    </Sidebar>
  );
}
