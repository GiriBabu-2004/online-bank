"use client";
 export default function AccountInfoPage() {
   return (
     <div className="min-h-screen flex items-center justify-center bg-[url('/background.png')] bg-repeat bg-[length:350px_350px] bg-center p-4"
      style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        backgroundBlendMode: "overlay",
      }}>
       <div className="bg-white/80 border border-yellow-400 p-6 rounded-2xl shadow-md w-full max-w-md">
         <h2 className="text-2xl font-bold mb-4">Account Information</h2>
         <p className="text-gray-600">This page will display user account information. Not developed yet</p>
         {/* Add your account info components here */}
       </div>
     </div>
   );
 }