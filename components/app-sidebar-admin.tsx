"use client"

import * as React from "react"
import {
  // IconCamera,
  // IconChartBar,
  IconDashboard,
  IconDatabase,
  // IconFileAi,
  // IconFileDescription,
  // IconFileWord,
  // IconFolder,
  // IconHelp,
  // IconInnerShadowTop,
  // IconListDetails,
  // IconReport,
  // IconSearch,
  IconSettings,
  // IconUsers,
} from "@tabler/icons-react"
import Image from "next/image";

import { NavDocuments } from "@/components/nav-documents"
// import { NavMain } from "@/components/nav-main"
// import { NavSecondary } from "@/components/nav-secondary"
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

const data = {
  user: {
    name: "Admin",
    email: "DLCF OAU",
    avatar: "/avatars/shadcn.jpg",
  },
  documents: [
    {
      name: "Dashboard",
      url: "/workspace/admin",
      icon: IconDashboard,
    },
    {
      name: "All attendance",
      url: "/workspace/admin/attendance",
      icon: IconDatabase,
    },
    {
      name: "Attendance by location",
      url: "/workspace/admin/attendance/location",
      icon: IconDatabase,
    },
  ],
}

export function AdminAppSidebar({
  user,
  ...props
}: { user: TUser } & React.ComponentProps<typeof Sidebar>) {
  const userdata = {
    name: user.firstName ? user.firstName : "DLCF User",
    email: user.email ? user.email : "",
    avatar: "/avatars/shadcn.jpg",
  };

  const logoutSide = async ()=>{
    logout();
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
                <Image src="/dlcfOAU.jpeg" alt="DLCF Logo" width={50} height={50} className="mx-auto mt-4"/>
                <span className="text-base font-semibold">DLCF OAU</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavDocuments items={data.documents} />
    
        <form action={logoutSide}>
          <Button className="bg-red-400 w-full text-white" type="submit">Logout</Button>
        </form>
        </SidebarContent>
      <SidebarFooter>
        <NavUser user={userdata} />
      </SidebarFooter>
    </Sidebar>
  )
}
