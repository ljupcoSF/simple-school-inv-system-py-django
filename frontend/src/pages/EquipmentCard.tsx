import type { Equipment } from "../types/models";

export default function EquipmentCard({ item, onPreview }: { item: Equipment; onPreview: (e: Equipment)=>void }) {
  const statusClass = item.status === "available" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800";
  return (
    <div className="p-4 border rounded hover:shadow transition">
      <h3 className="font-semibold">{item.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${statusClass}`}>{item.status}</span>
      <div className="mt-3">
        <button onClick={()=>onPreview(item)} className="px-3 py-1 bg-gray-900 text-white rounded">Preview</button>
      </div>
    </div>
  );
}
