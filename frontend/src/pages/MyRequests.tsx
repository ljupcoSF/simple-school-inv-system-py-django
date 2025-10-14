import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import type { BorrowRequest } from "../types/models";

export default function MyRequests() {
  const [rows, setRows] = useState<BorrowRequest[]>([]);

  useEffect(() => {
    api.get("/api/borrow-requests/").then(res => setRows(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Borrow Requests</h1>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Item</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Requested</th>
              <th className="text-left p-2">Returned</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.equipment_name}</td>
                <td className="p-2 capitalize">{r.status}</td>
                <td className="p-2">{new Date(r.request_date).toLocaleString()}</td>
                <td className="p-2">{r.return_date ? new Date(r.return_date).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
