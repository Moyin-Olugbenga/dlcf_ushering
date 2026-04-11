"use client";
import { useEffect, useState, useMemo } from "react";
import { TUser } from "@/app/types/user";
import { AttendanceRecord, InitialAttendanceRecord } from "@/app/types/attendance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE } from "@/lib/generated/prisma";
import { Label } from "./ui/label";
import TotalAttendanceTable from "./TotalAttendance";

export default function MonthlyLocationAttendance({ user }: { user: TUser }) {
  const [month, setMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  const [rawMonthlyData, setRawMonthlyData] = useState<AttendanceRecord[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string>("");
  const [selectedDateKey, setSelectedDateKey] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 1. Get unique Service Types available this month (e.g. SWS, MBS)
  const availableServiceTypes = useMemo(() => {
    const types = rawMonthlyData.map((r) => r.service);
    return Array.from(new Set(types)) as SERVICE[];
  }, [rawMonthlyData]);

  // 2. Get unique Dates for the selected Service Type
  // We use the ISO string as a key because multiple locations share the exact same date/time.
  const availableDates = useMemo(() => {
    const filteredByService = rawMonthlyData.filter(r => r.service === selectedServiceType);
    
    // Group by date to remove location-based duplicates
    const uniqueDatesMap = new Map();
    filteredByService.forEach(record => {
      const dateString = new Date(record.attendanceDate).toDateString();
      if (!uniqueDatesMap.has(dateString)) {
        uniqueDatesMap.set(dateString, record.attendanceDate);
      }
    });

    return Array.from(uniqueDatesMap.entries()).map(([label, value]) => ({
      label,
      value
    }));
  }, [selectedServiceType, rawMonthlyData]);

  // 3. Filter data for the Table: Show ALL locations for the chosen Type + Date
  const filteredTableData = useMemo(() => {
    if (!selectedServiceType || !selectedDateKey) return [];
    
    return rawMonthlyData.filter((r) => {
      const isSameType = r.service === selectedServiceType;
      const isSameDate = r.attendanceDate === selectedDateKey;
      return isSameType && isSameDate;
    });
  }, [selectedServiceType, selectedDateKey, rawMonthlyData]);
  useEffect(() => {
      // 1. Guard clause: Don't fetch if month isn't selected
      if (!month) return;

      const fetchMonthlyData = async () => {
        setLoading(true);
        try {
          // 2. We use POST to match your original API implementation
          const response = await fetch("/api/month/services", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ month }),
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }

          const result = await response.json();

          // 3. Update states
          // result.data will now be the raw array of Attendance records
          setRawMonthlyData(result.data || []);
          
          // 4. Reset selections so the user has to pick fresh for the new month
          setSelectedServiceType(""); 
          setSelectedDateKey("");

        } catch (error) {
          console.error("Error fetching monthly attendance:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMonthlyData();
    }, [month]);

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-wrap items-end gap-6 bg-slate-50 p-4 rounded-xl border">
        <div className="flex flex-col gap-2">
          <Label className="font-bold">1. Select Month</Label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded px-3 py-2 h-10 bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-bold">2. Service Type</Label>
          <Select
            value={selectedServiceType}
            onValueChange={(val) => {
              setSelectedServiceType(val);
              setSelectedDateKey("");
            }}
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Select Service" />
            </SelectTrigger>
            <SelectContent>
              {availableServiceTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-bold">3. Select Date</Label>
          <Select
            value={selectedDateKey}
            onValueChange={setSelectedDateKey}
            disabled={!selectedServiceType}
          >
            <SelectTrigger className="w-[240px] bg-white">
              <SelectValue placeholder="Pick the specific date" />
            </SelectTrigger>
            <SelectContent>
              {availableDates.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="py-4">
        {loading ? (
          <div className="text-center py-10 animate-pulse">Loading Attendance Records...</div>
        ) : filteredTableData.length > 0 ? (
          <div className="space-y-6">
             
             <div className="overflow-x-auto border rounded-xl shadow-lg bg-white">
               <TotalAttendanceTable data={filteredTableData} />
             </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-xl bg-gray-50">
            {selectedServiceType ? "Select a date to view all location records" : "Select a month and service type to begin"}
          </div>
        )}
      </div>
    </div>
  );
}