import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try { await login(username, password); nav("/"); }
    catch { setErr("Wrong username or password"); }
  }

  return (
    <div className="max-w-md mx-auto mt-14 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Username" value={username} onChange={e=>setU(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setP(e.target.value)} />
        <button className="w-full bg-gray-900 text-white p-2 rounded">Login</button>
      </form>
      <p className="mt-3 text-sm">
        No account? <Link to="/register" className="text-blue-600 underline">Register</Link>
      </p>
    </div>
  );
}
