import { AttendanceRecord } from "@/app/types/attendance";
import Link from "next/link";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";

interface AttendanceTableProps {
  data: AttendanceRecord[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ data }) => {
const router = useRouter();
    const [error, setErrors] = useState("");
    const [success, setSuccess] = useState("");
  const deleteRecord = async (uuid: string) => {
  console.log('Deleting record with UUID:', uuid);

  try {
    const {data} = await axios.delete(`/api/attendance/${uuid}/delete`,);
    if (data.error == true) {
      setErrors(data.message);
    } 
    else {
      setSuccess("Attendance created successfully");
    }

   
  } catch (error) {
    console.error('Error deleting record:', error);
  }
};
  return (
    <table className="min-w-full text-left text-black px-2 border-collapse border border-gray-400" border={1}>
        <tbody className="text-black">
            <tr className=" text-md ">
            <th className="border border-gray-300" rowSpan={2} align="center">Day</th>
            <th className="border border-gray-300" rowSpan={2} align="center">Date</th>
            <th className="border border-gray-300" colSpan={2} align="center">Student</th>
            <th className="border border-gray-300" colSpan={2} align="center">Non student</th>
            <th className="border border-gray-300" colSpan={2} align="center">Youth</th>
            <th className="border border-gray-300" colSpan={2} align="center">Children</th>
            <th className="border border-gray-300" colSpan={2} align="center">Guests</th>
            <th className="border border-gray-300" colSpan={2} align="center">Converts</th>
            <th className="border border-gray-300" colSpan={2} align="center">Newcomers</th>
            <th className="border border-gray-300" colSpan={2} align="center">Total</th>
            <th className="border border-gray-300" rowSpan={2} align="center">GrandTotal</th>
            <th className="border border-gray-300" rowSpan={2} colSpan={2} align="center">Actions</th>
            </tr>
            <tr className=" text-sm ">
            <th className="border border-gray-300">Male</th>
            <th className="border border-gray-300">Female</th>
            <th className="border border-gray-300">Male</th>
            <th className="border border-gray-300">Female</th>
            <th className="border border-gray-300">Male</th>
            <th className="border border-gray-300">Female</th>
            <th className="border border-gray-300">Male</th>
            <th className="border border-gray-300">Female</th>
            <th className="border border-gray-300">Male</th>
            <th className="border border-gray-300">Female</th>
            <th className="border border-gray-300">Male</th>
            <th className="border border-gray-300">Female</th>
            <th className="border border-gray-300">Male</th>
            <th className="border border-gray-300">Female</th>
            <th className="border border-gray-300">Male</th>
            <th className="border border-gray-300">Female</th>
            </tr>
        {data.map((record) => (
          <tr key={record.uuid} className="text-center">
            <td className="border px-3 py-2">{record.service}</td>
            <td className="border px-3 py-2">({new Date(record.attendanceDate).toLocaleDateString()})</td>
            {record.breakdowns.map((breakdown) => (
            <React.Fragment key={breakdown.id}>
                <td className="border px-3 py-2"> {breakdown.male} </td>
                <td className="border px-3 py-2"> {breakdown.female} </td>
            </React.Fragment>
            ))}
            <td className="border px-3 py-2">{record.totalMale}</td>
            <td className="border px-3 py-2">{record.totalFemale}</td>
            <td className="border px-3 py-2 font-semibold">{record.total}</td>
            <td className="border px-3 py-2">
              <Link href={`/workspace/usher/attendance/edit/${record.uuid}`} className="text-blue-600 hover:underline px-1">Edit</Link>
              </td>
              <td>
               <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <Button className="bg-red-500 text-white">Delete</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete profile</DialogTitle>
                      <DialogDescription>
                         {error && 
              <p className="error-feedback">
                <div role="alert" className="rounded-md border border-gray-300 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 text-red-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        <strong className="font-medium text-gray-900"> Success</strong>
                        <p className="mt-0.5 text-sm text-gray-700">{error}</p>
                      </div>
                      <button
                        className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                        type="button"
                        aria-label="Dismiss alert"
                      >
                        <span className="sr-only">Dismiss popup</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                </p>
                 } 
              {success && 
              <p className="success-feedback">
                <div role="alert" className="rounded-md border border-gray-300 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        <strong className="font-medium text-gray-900"> Success</strong>
                        <p className="mt-0.5 text-sm text-gray-700">{success}</p>
                      </div>
                      <button
                        className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                        type="button"
                        aria-label="Dismiss alert"
                      >
                        <span className="sr-only">Dismiss popup</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                </p>
                 } 
                        Are you sure you want to delete this record? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={() => deleteRecord(record.uuid)}  className="bg-red-500 text-white" type="submit">Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AttendanceTable;