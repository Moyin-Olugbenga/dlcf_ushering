"use client";
import { useEffect, useState } from "react";
import { TUser } from "@/app/types/user";
import { AttendanceRecord } from "@/app/types/attendance";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateAttendance } from "./CreateAttendance";
import AttendanceTable from "./locationAttendance";


export default function MonthlyLocationAttendance ({
    user
} : {
    user: TUser
}) {

  const  InitialAttendanceRecord = {
    id: 0,
    uuid: "",
    recordedById: "",
    location: "",
    service: "",
    totalMale: 0,
    totalFemale: 0,
    total: 0,
    attendanceDate: "",
    createdAt: "",
    updatedAt: "",
    breakdowns: [
      { id: 0, type: "", male: 0, female:0}
    ]
  };
  const [month, setMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [data, setData] = useState<AttendanceRecord[]>([InitialAttendanceRecord]);

  // const COLORS = ["#1E3A8A", "#EF4444", "#3B82F6", "#DC2626", "#7C3AED", "#F59E0B"];

  // Fetch attendance when month and location changes
  useEffect(() => {
    if (!month && !user.location) return;
    fetch(`/api/attendance/location/${user.location}`, {
      method: "POST",
      body: JSON.stringify({ month }),
    })
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, [month, user.location]);

  console.log(data)

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center gap-4">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700">Create Attendance</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Attendance</DialogTitle>
              <DialogDescription>
                <CreateAttendance user={user} />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
          <div className=" py-2 text-center text-lg text-black">{user.location} Attendance for {month}</div>
        <div className="overflow-x-auto border rounded-lg shadow">
          <AttendanceTable data={data} />
        </div>
              
      </div>

     
      
  );
}
