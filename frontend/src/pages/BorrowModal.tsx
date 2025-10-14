import type { Equipment } from "../types/models";

export default function BorrowModal({
  item, onClose, onConfirm,
}: { item: Equipment|null; onClose: ()=>void; onConfirm: ()=>void }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded p-4 max-w-md w-full">
        <h3 className="text-lg font-bold mb-2">Borrow Preview</h3>
        <p><strong>Item:</strong> {item.name}</p>
        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1 rounded border">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-1 rounded bg-blue-600 text-white">Request Borrow</button>
        </div>
      </div>
    </div>
  );
}
