import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div className="bg-gray-900 text-white px-4 py-3 flex justify-between">
      <Link to="/" className="font-bold">School Inventory</Link>
      <div className="flex items-center gap-3">
        {user && <span className="text-sm opacity-80">{user.username} ({user.role})</span>}
        {user ? (
          <button onClick={logout} className="bg-white text-gray-900 px-3 py-1 rounded">Logout</button>
        ) : (
          <Link to="/login" className="bg-white text-gray-900 px-3 py-1 rounded">Login</Link>
        )}
      </div>
    </div>
  );
}
