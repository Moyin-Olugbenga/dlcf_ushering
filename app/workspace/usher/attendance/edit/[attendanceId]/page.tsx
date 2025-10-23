"use client";
import { AppSidebar } from "@/components/app-sidebar"
import { EditAttendance } from "@/components/EditAttendance";
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AttendanceStore, useAttendance } from "@/Store/Attendance";
import { useUser, UserStore } from "@/Store/User"
import { useParams} from "next/navigation";
import { useEffect, useRef } from "react";


export default function AttendancePage() {
    const params = useParams();
  const id = params.attendanceId as string;
  console.log(id)
  const { data : user, fetchingUser } = useUser(); 
  const { data : attendance, fetchingAttendance } = useAttendance(); 

    const hasFetched = useRef(false);

    useEffect(() => {
    if (!hasFetched.current) {
        hasFetched.current = true;
        UserStore.fetchUserData();
        AttendanceStore.fetchAttendanceData(id);
    }
    }, [id]);
    
    

  if (fetchingUser || fetchingAttendance) return <p>Loading...</p>;


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
        {
        fetchingUser ? (
            <div className='mx-4 my-10'>
            <div className=""></div>
            </div>
        ) : (
            <>
            <AppSidebar user={user} variant="inset" />
        
      <SidebarInset>
        <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">  <EditAttendance user={user} attendance={attendance} />
                      
                 
                </div>
              </div>
            </div>
          </div>
      </SidebarInset>
    </>)}
    </SidebarProvider>
  )
}
