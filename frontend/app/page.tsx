"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

export default function Home() {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Signed in user:", result.user);
      alert(`Welcome, ${result.user.displayName}`);
    } catch (error) {
      console.error("Login error:", error);
      alert("Google sign-in failed");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-white pt-20">

      {/* Large Logo */}
      <img
        src="/logo.png"
        alt="Card Compass"
        className="w-[820px] max-w-[95%]"
      />

      {/* Google Sign In Button */}
      <button
        onClick={handleGoogleLogin}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xl font-medium hover:bg-blue-700 transition shadow-md -mt-25"
      >
        Sign in with Google
      </button>

    </main>
  );
}
