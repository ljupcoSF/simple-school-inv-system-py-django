import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

type EquipRow = {
  equipment_name: string;
  total_borrowed: number;
  total_returned: number;
  total_declined: number;
  current_borrowed: number;
};

type UserRow = {
  username: string;
  total_requests: number;
  approved: number;
  declined: number;
  returned: number;
};

export default function Reports() {
  const [equip, setEquip] = useState<EquipRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    api.get("/api/reports/equipment-usage/").then(r => setEquip(r.data));
    api.get("/api/reports/user-activity/").then(r => setUsers(r.data));
  }, []);

  function downloadCSV(filename: string, rows: any[]) {
    const keys = Object.keys(rows[0] || {});
    const csv = [keys.join(","), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <div className="mb-6 flex items-center gap-2">
        <button className="px-3 py-1 bg-gray-900 text-white rounded"
                onClick={()=>downloadCSV("equipment-usage.csv", equip)}>Export Equipment CSV</button>
        <button className="px-3 py-1 bg-gray-900 text-white rounded"
                onClick={()=>downloadCSV("user-activity.csv", users)}>Export Users CSV</button>
      </div>

      <h2 className="font-semibold mb-2">Equipment Usage</h2>
      <div className="h-72 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={equip}>
            <XAxis dataKey="equipment_name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_borrowed" />
            <Bar dataKey="current_borrowed" />
            <Bar dataKey="total_returned" />
            <Bar dataKey="total_declined" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 className="font-semibold mb-2">User Activity</h2>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Approved</th>
              <th className="p-2 text-left">Declined</th>
              <th className="p-2 text-left">Returned</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.total_requests}</td>
                <td className="p-2">{u.approved}</td>
                <td className="p-2">{u.declined}</td>
                <td className="p-2">{u.returned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
