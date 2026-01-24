"use client";

import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </main>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Large Logo */}
      <img
        src="/logo.png"
        alt="Card Compass"
        className="w-[820px] max-w-[95%] mb-12"
      />

      {/* Login Form */}
      <LoginForm />
    </main>
  );
}
