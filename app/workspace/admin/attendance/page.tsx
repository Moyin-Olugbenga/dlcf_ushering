import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import MonthlyAttendance from "@/components/monthlyAttendance"
import { AdminAppSidebar } from "@/components/app-sidebar-admin"

import { useUser } from "@/Store/User";


export default function Page() {
  const { data : user, fetchingUser } = useUser();
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
          <div className="">Loading...</div>
        </div>
      ) : (
        <>
      <AdminAppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
             
              <div className="px-4 lg:px-6">
                <MonthlyAttendance />
              </div>
              {/* <DataTable data={data} /> */}
            </div>
          </div>
        </div>
      </SidebarInset>
                     </> ) }
    </SidebarProvider>
  )
}
