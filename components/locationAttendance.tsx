"use client";
import { AttendanceRecord } from "@/app/types/attendance";
import Link from "next/link";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface AttendanceTableProps {
  data: AttendanceRecord[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ data }) => {
  const router = useRouter();
  const [error, setErrors] = useState("");
  const [success, setSuccess] = useState("");

  const deleteRecord = async (uuid: string) => {
    try {
      const response = await axios.delete(`/api/attendance/${uuid}/delete`);
      if (response.data.error === true) {
        setErrors(response.data.message);
      } else {
        setSuccess("Record deleted successfully");
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  // PDF Download Logic
  const downloadPDF = () => {
    const doc = new jsPDF("landscape");
    
    // Add a Title
    doc.setFontSize(16);
    doc.text("Attendance Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      html: "#attendance-main-table",
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 2 },
      // Filter out the 'Actions' column from the PDF
      columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] 
    });

    doc.save("attendance_report.pdf");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
          Download PDF
        </Button>
      </div>

      <table id="attendance-main-table" className="min-w-full text-left text-black px-2 border-collapse border border-gray-400">
        <thead className="text-black bg-gray-50">
          <tr className="text-md">
            <th className="border border-gray-300 p-2" rowSpan={2} align="center">Day</th>
            <th className="border border-gray-300 p-2" rowSpan={2} align="center">Date</th>
            <th className="border border-gray-300 p-2" colSpan={2} align="center">Student</th>
            <th className="border border-gray-300 p-2" colSpan={2} align="center">Non student</th>
            <th className="border border-gray-300 p-2" colSpan={2} align="center">Youth</th>
            <th className="border border-gray-300 p-2" colSpan={2} align="center">Children</th>
            <th className="border border-gray-300 p-2" colSpan={2} align="center">Guests</th>
            <th className="border border-gray-300 p-2" colSpan={2} align="center">Converts</th>
            <th className="border border-gray-300 p-2" colSpan={2} align="center">Newcomers</th>
            <th className="border border-gray-300 p-2" colSpan={2} align="center">Total</th>
            <th className="border border-gray-300 p-2" rowSpan={2} align="center">GrandTotal</th>
            <th className="border border-gray-300 p-2 action-column" rowSpan={2} colSpan={2} align="center">Actions</th>
          </tr>
          <tr className="text-sm">
            {/* Repeated M/F headers */}
            {[...Array(8)].map((_, i) => (
              <React.Fragment key={i}>
                <th className="border border-gray-300 p-1">M</th>
                <th className="border border-gray-300 p-1">F</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody className="text-black">
          {data.map((record) => (
            <tr key={record.uuid} className="text-center hover:bg-gray-50">
              <td className="border px-3 py-2">{record.service}</td>
              <td className="border px-3 py-2">{new Date(record.attendanceDate).toLocaleDateString()}</td>
              {record.breakdowns.map((breakdown) => (
                <React.Fragment key={breakdown.id}>
                  <td className="border px-3 py-2">{breakdown.male}</td>
                  <td className="border px-3 py-2">{breakdown.female}</td>
                </React.Fragment>
              ))}
              <td className="border px-3 py-2">{record.totalMale}</td>
              <td className="border px-3 py-2">{record.totalFemale}</td>
              <td className="border px-3 py-2 font-semibold">{record.total}</td>
              
              {/* Action Buttons */}
              <td className="border px-3 py-2 action-column">
                <Link href={`/workspace/usher/attendance/edit/${record.uuid}`} className="text-blue-600 hover:underline">
                  Edit
                </Link>
              </td>
              <td className="border px-3 py-2 action-column">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this record? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={() => deleteRecord(record.uuid)} className="bg-red-600">
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;