"use client";
import React, { useRef } from "react";
import { AttendanceRecord } from "@/app/types/attendance";
import { Button } from "./ui/button";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface AttendanceTableProps {
  data: AttendanceRecord[];
}

const TotalAttendanceTable: React.FC<AttendanceTableProps> = ({ data }) => {
  const tableRef = useRef(null);

  if (!data || data.length === 0) return <div>No data available</div>;

  const currentService = data[0].service;
  const currentDate = new Date(data[0].attendanceDate).toLocaleDateString("en-GB");
  const locationCount = data.length;

  const getVal = (loc: string, type: string, gender: "male" | "female") => {
    const record = data.find((r) => r.location === loc);
    const breakdown = record?.breakdowns.find((b) => b.type === type);
    return breakdown ? breakdown[gender] : 0;
  };

  const downloadPDF = () => {
    // Set to landscape to maximize horizontal space 
    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(currentService, pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(currentDate, pageWidth / 2, 22, { align: "center" });

    doc.setTextColor(220, 38, 38);
    doc.setFontSize(10);
    doc.text(`Showing data from ${locationCount} locations`, pageWidth / 2, 28, { align: "center" });

    doc.setTextColor(0, 0, 0); 

    // Main Table with Horizontal Page Break Support
    autoTable(doc, { 
      html: "#attendance-report-table", 
      startY: 35,
      theme: "grid",
      // This is critical for many columns: it moves extra columns to a new page
      horizontalPageBreak: true, 
      styles: { 
        lineColor: [0, 0, 0], 
        lineWidth: 0.2, 
        textColor: [0, 0, 0], 
        fontSize: 8, // Reduced slightly for better fit
        cellPadding: 2 
      },
      headStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
    });

    // Summary Table Calculation 
    const totalMale = data.reduce((acc, curr) => acc + curr.totalMale, 0);
    const totalFemale = data.reduce((acc, curr) => acc + curr.totalFemale, 0);
    const grandTotal = data.reduce((acc, curr) => acc + curr.total, 0);

    // Get the Y position after the main table finishes
    const finalY = (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY + 10,
      margin: { left: (pageWidth - 100) / 2 }, 
      tableWidth: 100,
      body: [
        [{ content: 'SUMMARY OF ALL LOCATION ATTENDANCE', colSpan: 2, styles: { halign: 'center', fillColor: [230, 230, 230], fontStyle: 'bold' } }],
        ['TOTAL MALE', totalMale.toString()],
        ['TOTAL FEMALE', totalFemale.toString()],
        ['GRAND TOTAL', grandTotal.toString()]
      ],
      styles: { lineColor: [0, 0, 0], lineWidth: 0.2 },
      theme: 'grid'
    });

    doc.save(`${currentService}_${currentDate}.pdf`);
  };
// Combine STUDENT and NON_STUDENT into a single "ADULT" value 
    const getAdultVal = (loc: string, gender: "male" | "female") => {
        const students = getVal(loc, "STUDENT", gender);
        const nonStudents = getVal(loc, "NON_STUDENT", gender);
        return students + nonStudents;
    };
  return (
    <div className="flex flex-col items-center w-full space-y-6 p-4">
      <div className="flex justify-end w-full max-w-7xl">
        <Button onClick={downloadPDF} className="bg-red-700 hover:bg-red-800 text-white">
          Download PDF Report
        </Button>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold uppercase">{currentService}</h1>
        <p className="text-gray-600 font-medium">{currentDate}</p>
        <p className="mt-2 inline-block px-4 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Showing data from {locationCount} locations
        </p>
      </div>
      
      {/* Container for web horizontal scroll */}
      <div className="w-full overflow-x-auto border border-black shadow-sm rounded-lg">
        <table id="attendance-report-table" className="min-w-full border-collapse text-sm text-black bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-left sticky left-0 bg-gray-100 z-10">LOCATIONS</th>
              {data.map((r) => (
                <th key={r.uuid} className="border border-black p-2 text-center text-[10px] uppercase whitespace-nowrap">
                  {r.location.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
                <td className="border border-black p-2 font-semibold sticky left-0 bg-white">ADULT (MALE)</td>
                {data.map((r) => (
                    <td key={r.uuid} className="border border-black p-2 text-center">
                    {getAdultVal(r.location, "male")} 
                    </td>
                ))}
                </tr>
                <tr>
                <td className="border border-black p-2 font-semibold sticky left-0 bg-white">ADULT (FEMALE)</td>
                {data.map((r) => (
                    <td key={r.uuid} className="border border-black p-2 text-center">
                    {getAdultVal(r.location, "female")}
                    </td>
                ))}
            </tr>
            <tr>
              <td className="border border-black p-2 font-semibold text-blue-800 sticky left-0 bg-white">YOUTH (BOYS)</td>
              {data.map((r) => <td key={r.uuid} className="border border-black p-2 text-center">{getVal(r.location, "YOUTH", "male")}</td>)}
            </tr>
            <tr>
              <td className="border border-black p-2 font-semibold text-blue-800 sticky left-0 bg-white">YOUTH (GIRLS)</td>
              {data.map((r) => <td key={r.uuid} className="border border-black p-2 text-center">{getVal(r.location, "YOUTH", "female")}</td>)}
            </tr>
            <tr>
              <td className="border border-black p-2 font-semibold text-green-800 sticky left-0 bg-white">CHILDREN (BOYS)</td>
              {data.map((r) => <td key={r.uuid} className="border border-black p-2 text-center">{getVal(r.location, "CHILDREN", "male")}</td>)}
            </tr>
            <tr>
              <td className="border border-black p-2 font-semibold text-green-800 sticky left-0 bg-white">CHILDREN (GIRLS)</td>
              {data.map((r) => <td key={r.uuid} className="border border-black p-2 text-center">{getVal(r.location, "CHILDREN", "female")}</td>)}
            </tr>
            <tr className="bg-gray-50 font-bold border-t-2 border-black">
              <td className="border border-black p-2 sticky left-0 bg-gray-50">TOTAL</td>
              {data.map((r) => <td key={r.uuid} className="border border-black p-2 text-center">{r.total}</td>)}
            </tr>
            <tr>
              <td className="border border-black p-2 font-semibold sticky left-0 bg-white">NEWCOMERS</td>
              {data.map((r) => (
                <td key={r.uuid} className="border border-black p-2 text-center">
                  {getVal(r.location, "NEWCOMER", "male") + getVal(r.location, "NEWCOMER", "female")}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-black p-2 font-semibold sticky left-0 bg-white">CONVERTS</td>
              {data.map((r) => (
                <td key={r.uuid} className="border border-black p-2 text-center">
                  {getVal(r.location, "CONVERT", "male") + getVal(r.location, "CONVERT", "female")}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        
        {/* Centered Summary Box  */}
        <div className="w-full max-w-md border-2 border-black bg-white shadow-md rounded-md overflow-hidden">
            <div className="bg-gray-200 p-3 font-bold border-b-2 border-black text-center text-sm">
            SUMMARY OF ALL LOCATION ATTENDANCE
            </div>
            <div className="flex justify-between p-3 border-b border-black text-sm">
            <span>TOTAL MALE</span>
            <span className="font-bold">{data.reduce((acc, curr) => acc + curr.totalMale, 0)}</span>
            </div>
            <div className="flex justify-between p-3 border-b border-black text-sm">
            <span>TOTAL FEMALE</span>
            <span className="font-bold">{data.reduce((acc, curr) => acc + curr.totalFemale, 0)}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 font-extrabold text-lg">
            <span>GRAND TOTAL</span>
            <span>{data.reduce((acc, curr) => acc + curr.total, 0)}</span>
            </div>
        </div>
      </div>

    </div>
  );
};

export default TotalAttendanceTable;