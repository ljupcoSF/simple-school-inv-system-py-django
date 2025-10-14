import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="w-60 bg-gray-100 p-4 min-h-[calc(100vh-56px)]">
      <nav className="space-y-2">
        <Link className="block p-2 hover:bg-gray-200 rounded" to="/">Dashboard</Link>
        <Link className="block p-2 hover:bg-gray-200 rounded" to="/equipment">Equipment</Link>
        <Link className="block p-2 hover:bg-gray-200 rounded" to="/my-requests">My Requests</Link>
        {user?.role === "admin" && (
          <>
            <Link className="block p-2 hover:bg-gray-200 rounded" to="/admin/requests">Admin Requests</Link>
            <Link className="block p-2 hover:bg-gray-200 rounded" to="/reports">Reports</Link>
          </>
        )}
      </nav>
    </aside>
  );
}
