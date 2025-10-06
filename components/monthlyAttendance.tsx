"use client";
import { useEffect, useState, useRef } from "react";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";


export default function MonthlyAttendance() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [month, setMonth] = useState<string>(() => {
    // default: current month
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [data, setData] = useState<any>(null);
  const COLORS = ["#1E3A8A", "#EF4444", "#3B82F6", "#DC2626", "#7C3AED", "#F59E0B"];

  // Fetch attendance when month changes
  useEffect(() => {
    if (!month) return;
    fetch("/api/month", {
      method: "POST",
      body: JSON.stringify({ month }),
    })
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, [month]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

 try {
      const imgData = await toPng(reportRef.current, { cacheBust: true });

      // Init PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add extra pages if needed
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

        pdf.save(`attendance-report-${month}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  if (!data) return <p className="p-6">Loading...</p>;

  const locations = Object.keys(data);

  // Transform data for charts
  const chartData = locations.map((loc) => ({
    location: loc,
    NonStudents: (data[loc].NONSTUDENT_MALE || 0) + (data[loc].NONSTUDENT_FEMALE || 0),
    Students: (data[loc].STUDENT_MALE || 0) + (data[loc].STUDENT_FEMALE || 0),
    Youth: (data[loc].YOUTH_MALE || 0) + (data[loc].YOUTH_FEMALE || 0),
    Children: (data[loc].CHILDREN_MALE || 0) + (data[loc].CHILDREN_FEMALE || 0),
    Guests: (data[loc].GUEST_MALE || 0) + (data[loc].GUEST_FEMALE || 0),
    Newcomers: (data[loc].NEWCOMER_MALE || 0) + (data[loc].NEWCOMER_FEMALE || 0),
    Converts: (data[loc].CONVERT_MALE || 0) + (data[loc].CONVERT_FEMALE || 0),
    Total: data[loc].TOTAL || 0,
  }));

  const pieData = [
    { name: "NonStudents", value: chartData.reduce((a, b) => a + b.NonStudents, 0) },
    { name: "Students", value: chartData.reduce((a, b) => a + b.Students, 0) },
    { name: "Youth", value: chartData.reduce((a, b) => a + b.Youth, 0) },
    { name: "Children", value: chartData.reduce((a, b) => a + b.Children, 0) },
    { name: "Guests", value: chartData.reduce((a, b) => a + b.Guests, 0) },
    { name: "Newcomers", value: chartData.reduce((a, b) => a + b.Newcomers, 0) },
    { name: "Converts", value: chartData.reduce((a, b) => a + b.Converts, 0) },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Month picker + Download button */}
      <div className="flex items-center gap-4">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700"
        >
          Download PDF
        </button>
      </div>

      {/* Report container */}
      <div ref={reportRef} className="bg-white p-6 rounded-xl shadow space-y-8">
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
      {[
        "NONSTUDENT_MALE", "NONSTUDENT_FEMALE",
        "STUDENT_MALE", "STUDENT_FEMALE",
        "YOUTH_MALE", "YOUTH_FEMALE",
        "CHILDREN_MALE", "CHILDREN_FEMALE",
        "GUEST_MALE", "GUEST_FEMALE",
        "NEWCOMER_MALE", "NEWCOMER_FEMALE",
        "CONVERT_MALE", "CONVERT_FEMALE",
        "TOTAL"
      ].map((row) => (
        <tr key={row} className="border-t">
          <td className="px-4 py-2 font-medium">
            {row.replace(/_/g, " ")}
          </td>
          {locations.map((loc) => (
            <td key={loc} className="px-4 py-2 text-center">
              {data[loc][row] ?? 0}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {/* Bar Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="NonStudents" fill="#1E3A8A" />
              <Bar dataKey="Students" fill="#3B82F6" />
              <Bar dataKey="Youth" fill="#EF4444" />
              <Bar dataKey="Children" fill="#DC2626" />
              <Bar dataKey="Guests" fill="#7C3AED" />
              <Bar dataKey="Newcomers" fill="#F59E0B" />
              <Bar dataKey="Converts" fill="#22C55E" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Total" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120} label>
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
