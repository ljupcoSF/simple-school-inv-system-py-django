import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EquipmentList from './pages/EquipmentList';
import MyRequests from './pages/MyRequests';
import AdminRequests from './pages/AdminRequests';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import Sidebar from './components/Sidebar';
import Navbar from "./components/Navbar.tsx";
import {TooltipProvider} from "./components/ui/tooltip.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import {Toaster} from "./components/ui/toaster.tsx";
import { Toaster as Sonner } from './components/ui/sonner';
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AdminEquipment from "./pages/AdminEquipment.tsx";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes with layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/equipment"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <EquipmentList />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-equipment"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout>
                      <AdminEquipment />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-requests"
                element={
                  <ProtectedRoute requiredRole="student">
                    <AppLayout>
                      <MyRequests />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-requests"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout>
                      <AdminRequests />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout>
                      <Reports />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Redirect root to dashboard */}
              <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
