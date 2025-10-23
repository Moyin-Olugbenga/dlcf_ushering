"use client";
import { useEffect, useState } from "react";
import { TUser } from "@/app/types/user";
import { AttendanceRecord, InitialAttendanceRecord } from "@/app/types/attendance";
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AttendanceTable from "./locationAttendance";
import { LOCATION } from "@/lib/generated/prisma";
import { Label } from "./ui/label";


export default function MonthlyLocationAttendance ({
    user
} : {
    user: TUser
}) {

  const [month, setMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [data, setData] = useState<AttendanceRecord[]>([InitialAttendanceRecord]);
  const [location, setLocation] = useState('')


      // const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      //   setLocation(event.target.value);
      //   // You can perform other actions here based on the new value
      //   console.log('Selected value:', event.target.value);
      // };
  // Fetch attendance when month and location changes
  useEffect(() => {
    if (!month && location) return;
    fetch(`/api/attendance/location/${location}`, {
      method: "POST",
      body: JSON.stringify({ month }),
    })
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, [month, location]);

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center gap-4">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded px-3 py-2"
        />
                <div className="flex items-center gap-1">
                  <Label htmlFor="">Location</Label>
                  <div className="flex items-center">
                    <Select name="location" value={location} onValueChange={(value) => setLocation(value)}>
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
                    </Select>
                  </div>
                </div>
        </div>
          <div className=" py-2 text-center text-lg text-black">{location} Attendance for {month}</div>
        <div className="overflow-x-auto border rounded-lg shadow">
          <AttendanceTable data={data} />
        </div>
              
      </div>

     
      
  );
}
