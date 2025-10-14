import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import type { BorrowRequest, BorrowStatus } from "../types/models";

export default function AdminRequests() {
  const [rows, setRows] = useState<BorrowRequest[]>([]);
  const [selected, setSelected] = useState<BorrowRequest | null>(null);
  const [newStatus, setNewStatus] = useState<BorrowStatus>("approved");

  async function load() {
    const { data } = await api.get("/api/borrow-requests/");
    setRows(data);
  }
  useEffect(() => { load(); }, []);

  async function applyStatus() {
    if (!selected) return;
    await api.patch(`/api/borrow-requests/${selected.id}/`, { status: newStatus });
    setSelected(null);
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin: Manage Borrow Requests</h1>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Requested</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.user}</td>
                <td className="p-2">{r.equipment_name}</td>
                <td className="p-2 capitalize">{r.status}</td>
                <td className="p-2">{new Date(r.request_date).toLocaleString()}</td>
                <td className="p-2">
                  <button onClick={()=>{ setSelected(r); setNewStatus("approved"); }}
                          className="px-2 py-1 bg-green-600 text-white rounded mr-2">Preview Approve</button>
                  <button onClick={()=>{ setSelected(r); setNewStatus("declined"); }}
                          className="px-2 py-1 bg-red-600 text-white rounded mr-2">Preview Decline</button>
                  <button onClick={()=>{ setSelected(r); setNewStatus("returned"); }}
                          className="px-2 py-1 bg-blue-600 text-white rounded">Preview Return</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded p-4 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Confirm Change</h3>
            <p><strong>Request:</strong> {selected.user} → {selected.equipment_name}</p>
            <p className="mb-4">Set status to <b className="capitalize">{newStatus}</b>?</p>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded border" onClick={()=>setSelected(null)}>Cancel</button>
              <button className="px-3 py-1 rounded bg-gray-900 text-white" onClick={applyStatus}>Yes, change it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
