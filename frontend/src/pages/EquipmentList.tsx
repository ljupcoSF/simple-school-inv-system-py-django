import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import type { Equipment } from "../types/models";
import EquipmentCard from "./EquipmentCard.tsx";
import BorrowModal from "./BorrowModal.tsx";


export default function EquipmentList() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<Equipment|null>(null);
  const [statusFilter, setStatusFilter] = useState<"all"|"available"|"borrowed">("all");

  useEffect(() => {
    api.get("/api/equipment/").then(res => setItems(res.data));
  }, []);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(query.toLowerCase()) &&
    (statusFilter === "all" || i.status === statusFilter)
  );

  async function confirmBorrow() {
    if (!preview) return;
    await api.post("/api/borrow-requests/", { equipment: preview.id });
    setPreview(null);
    alert("Request sent!");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Equipment Catalog</h1>

      <div className="flex gap-2 mb-4">
        <input className="border p-2 rounded flex-1" placeholder="Search by name..."
               value={query} onChange={e=>setQuery(e.target.value)} />
        <select className="border p-2 rounded" value={statusFilter}
                onChange={e=>setStatusFilter(e.target.value as any)}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map(eq => (
          <EquipmentCard key={eq.id} item={eq} onPreview={setPreview} />
        ))}
      </div>

      <BorrowModal item={preview} onClose={()=>setPreview(null)} onConfirm={confirmBorrow} />
    </div>
  );
}
