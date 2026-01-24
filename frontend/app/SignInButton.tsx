"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

export default function SignInButton() {
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
    <button
      onClick={handleGoogleLogin}
      className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xl font-medium hover:bg-blue-700 transition shadow-md -mt-25"
    >
      Sign in with Google
    </button>
  );
}
