export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white pt-20">


      {/* Large Logo */}
      <img
        src="/logo.png"
        alt="Card Compass"
        className="w-[820px] max-w-[95%]"
      />

      {/* Google Sign In Button */}
      <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xl font-medium hover:bg-blue-700 transition shadow-md -mt-25">
        Sign in with Google
      </button>

    </main>
  );
}
