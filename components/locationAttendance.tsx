import { AttendanceRecord } from "@/app/types/attendance";

interface AttendanceTableProps {
  data: AttendanceRecord[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ data }) => {
  return (
    <table className="min-w-full text-left text-black px-2 border-collapse border border-gray-400" border={1}>
        <tbody className="text-black">
            <tr className=" text-md ">
            <th className="border border-gray-300" rowSpan={2} align="center">Day(Date)</th>
            <th className="border border-gray-300" colSpan={2} align="center">Student</th>
            <th className="border border-gray-300" colSpan={2} align="center">Non student</th>
            <th className="border border-gray-300" colSpan={2} align="center">Youth</th>
            <th className="border border-gray-300" colSpan={2} align="center">Children</th>
            <th className="border border-gray-300" colSpan={2} align="center">Guests</th>
            <th className="border border-gray-300" colSpan={2} align="center">Converts</th>
            <th className="border border-gray-300" colSpan={2} align="center">Newcomers</th>
            <th className="border border-gray-300" colSpan={2} align="center">Total</th>
            <th className="border border-gray-300" rowSpan={2} align="center">GrandTotal</th>
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
          <tr key={record.id} className="text-center">
            <td className="border px-3 py-2">{record.service}({new Date(record.attendanceDate).toLocaleDateString()})</td>
            {record.breakdowns.map((breakdown) => (
                <>
              <td className="border px-3 py-2" key={breakdown.id}>
                {breakdown.male}
              </td>
              <td className="border px-3 py-2">
                {breakdown.female}
              </td>
                </>
            ))}
            <td className="border px-3 py-2">{record.totalMale}</td>
            <td className="border px-3 py-2">{record.totalFemale}</td>
            <td className="border px-3 py-2 font-semibold">{record.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AttendanceTable;