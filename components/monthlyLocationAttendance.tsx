"use client";
import { useEffect, useState } from "react";
import { TUser } from "@/app/types/user";
import { AttendanceField } from "@/app/types/attendance";
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


export default function MonthlyLocationAttendance ({
    user
} : {
    user: TUser
}) {
  const [month, setMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [data, setData] = useState<unknown>(null);
  // const COLORS = ["#1E3A8A", "#EF4444", "#3B82F6", "#DC2626", "#7C3AED", "#F59E0B"];

  // Fetch attendance when month and location changes
  useEffect(() => {
    if (!month && !user.location) return;
    fetch(`/api/attendance/location/${user.location}`, {
      method: "GET",
      body: JSON.stringify({ month }),
    })
      .then((res) => res.json())
      .then((res) => setData(res.data.data));
  }, [month, user.location]);

  if (!data) return <p className="p-6">Loading...</p>;  
  const dataObj = data as Record<
  string,
  {
    NONSTUDENT_MALE?: number;
    NONSTUDENT_FEMALE?: number;
    STUDENT_MALE?: number;
    STUDENT_FEMALE?: number;
    YOUTH_MALE?: number;
    YOUTH_FEMALE?: number;
    CHILDREN_MALE?: number;
    CHILDREN_FEMALE?: number;
    GUEST_MALE?: number;
    GUEST_FEMALE?: number;
    NEWCOMER_MALE?: number;
    NEWCOMER_FEMALE?: number;
    CONVERT_MALE?: number;
    CONVERT_FEMALE?: number;
    TOTAL?: number;
  }
>;

const locations = Object.keys(dataObj);


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
                      <CreateAttendance/>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
        {/* <Select name="location"  value={location} onValueChange={(value: SetStateAction<string>) => setLocation(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value={LOCATION.RELIGION_GROUND}>Religion Ground</SelectItem>
                      <SelectItem value={LOCATION.EDE_ROAD}>Ede road</SelectItem>
                      <SelectItem value={LOCATION.DAMICO}>Damico</SelectItem>
                      <SelectItem value={LOCATION.KOIWO}>Koiwo</SelectItem>
                      <SelectItem value={LOCATION.URBAN_DAY}>Urban day</SelectItem>
                      <SelectItem value={LOCATION.ELEYELE}>Eleyele</SelectItem>
                      <SelectItem value={LOCATION.AJEBAMIDELE}>Ajebamidele</SelectItem>
                      <SelectItem value={LOCATION.ROAD7}>Road 7</SelectItem>
                      <SelectItem value={LOCATION.QUARTERS}>Quarters</SelectItem>
                      <SelectItem value={LOCATION.PG}>PG</SelectItem>
                      <SelectItem value={LOCATION.MOREMI}>Moremi Estate</SelectItem>
                      <SelectItem value={LOCATION.CORPERS}>Corpers</SelectItem>
                      <SelectItem value={LOCATION.IJEDU}>Ijedu</SelectItem>
                      <SelectItem value={LOCATION.OAU_THC}>OAUTHC</SelectItem>
                      <SelectItem value={LOCATION.CDL}>CDL</SelectItem>
                      <SelectItem value={LOCATION.OMOLE}>Omole</SelectItem>
                  </SelectContent>
                </Select> */}
        
      </div>

      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-black">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2">Category</th>
                    {locations.map((loc) => (
                    <th key={loc} className="px-4 py-2">{loc}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="text-black">
           {( [
               "NONSTUDENT_MALE", "NONSTUDENT_FEMALE",
               "STUDENT_MALE", "STUDENT_FEMALE",
               "YOUTH_MALE", "YOUTH_FEMALE",
               "CHILDREN_MALE", "CHILDREN_FEMALE",
               "GUEST_MALE", "GUEST_FEMALE",
               "NEWCOMER_MALE", "NEWCOMER_FEMALE",
               "CONVERT_MALE", "CONVERT_FEMALE",
               "TOTAL",
             ] as AttendanceField[]).map((row) => (
                   <tr key={row} className="border-t">
                     <td className="px-4 py-2 font-medium">
                       {row.replace(/_/g, " ")}
                     </td>
                     {locations.map((loc) => (
                       <td key={loc} className="px-4 py-2 text-center">
                         {dataObj[loc][row] ?? 0}
                       </td>
                     ))}
                   </tr>
                 ))}
            </tbody>
        </table>
      </div>

      
    </div>
  );
}
