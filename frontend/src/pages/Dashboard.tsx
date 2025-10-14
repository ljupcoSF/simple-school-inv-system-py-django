import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.first_name || user?.username}!</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/equipment" className="p-4 border rounded hover:shadow">
          <h2 className="font-semibold">Browse Equipment</h2>
          <p>Search and view what’s available.</p>
        </Link>
        <Link to="/my-requests" className="p-4 border rounded hover:shadow">
          <h2 className="font-semibold">My Requests</h2>
          <p>See the status of your borrow requests.</p>
        </Link>
        {user?.role === "admin" && (
          <>
            <Link to="/admin/requests" className="p-4 border rounded hover:shadow">
              <h2 className="font-semibold">Admin: Manage Requests</h2>
              <p>Approve, decline, and mark returns.</p>
            </Link>
            <Link to="/reports" className="p-4 border rounded hover:shadow">
              <h2 className="font-semibold">Reports</h2>
              <p>See equipment & user statistics.</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
