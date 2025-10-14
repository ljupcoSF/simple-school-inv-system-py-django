import { useState } from "react";
import api from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [f, setF] = useState({ username:"", email:"", password:"", password2:"", role:"student" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.post("users/auth/register/", f);
    nav("/login");
  }

  return (
    <div className="max-w-md mx-auto mt-14 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Username" value={f.username} onChange={e=>setF({...f, username:e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Email" value={f.email} onChange={e=>setF({...f, email:e.target.value})} />
        <select className="w-full border p-2 rounded" value={f.role} onChange={e=>setF({...f, role:e.target.value})}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={f.password} onChange={e=>setF({...f, password:e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Confirm Password" type="password" value={f.password2} onChange={e=>setF({...f, password2:e.target.value})} />
        <button className="w-full bg-gray-900 text-white p-2 rounded">Create account</button>
      </form>
      <p className="mt-3 text-sm">
        Have an account? <Link to="/login" className="text-blue-600 underline">Login</Link>
      </p>
    </div>
  );
}
