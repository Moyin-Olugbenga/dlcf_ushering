"use client";
import { AppSidebar } from "@/components/app-sidebar"
import { EditRole } from "@/components/EditRole";
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useUser, UserStore, useUsers } from "@/Store/User"
import { useEffect, useRef } from "react";


export default function RolesPage() {
  const { data : user, fetchingUser } = useUser(); 
  const { data : users, fetchingUsers } = useUsers();

    const hasFetched = useRef(false);

    useEffect(() => {
    if (!hasFetched.current) {
        hasFetched.current = true;
        UserStore.fetchUserData();
        UserStore.fetchUsers();
    }
    }, []);
    


  if (fetchingUser || fetchingUsers) return <p>Loading user...</p>;


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} variant="inset"/>
      <SidebarInset>
        <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  {
                    fetchingUser ? (
                      <div className='mx-4 my-10'>
                        <div className=""></div>
                      </div>
                    ) :  
                  <table className="min-w-full text-left text-black px-2 border-collapse border border-gray-400" border={1}>
          <tbody className="text-black">
            <tr className=" text-md ">
            <th className="border border-gray-300" align="center">First Name</th>
            <th className="border border-gray-300" align="center">Last Name</th>
            <th className="border border-gray-300" align="center">Location</th>
            <th className="border border-gray-300" align="center">email</th>
            <th className="border border-gray-300" align="center">User type</th>
            <th className="border border-gray-300" align="center">Action</th>
            </tr>
           
        {users.map((record) => (
          <tr key={record.uuid} className="text-center">
            <td className="border px-3 py-2">{record.firstName}</td>
            <td className="border px-3 py-2">{record.lastName}</td>
            <td className="border px-3 py-2">{record.location}</td>
            <td className="border px-3 py-2">{record.email}</td>
            <td className="border px-3 py-2">{record.userType}</td>
              <td>
               <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-500 text-white">Update</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogDescription>
                         <EditRole user={record}/>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
                      }
                 
                </div>
              </div>
            </div>
          </div>
       
      </SidebarInset>
    </SidebarProvider>
  )
}
