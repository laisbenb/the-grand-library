"use client";

import { useState, useTransition } from "react";
import { requestBorrow } from "../books/action";

export default function BorrowButton({
  bookId,
  isBorrowed,
}: {
  bookId: number;
  isBorrowed: boolean;
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleBorrow = async () => {
    startTransition(async () => {
      await requestBorrow(bookId);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={handleBorrow}
        disabled={isBorrowed || isPending}
        className={`px-4 py-2 rounded text-white transition ${
          isBorrowed
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {isBorrowed ? "📚 Already Borrowed" : isPending ? "⏳ Sending..." : "📖 Borrow Book"}
      </button>

      {/* ✅ Popup */}
      {showPopup && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-green-500 text-white text-sm px-4 py-2 rounded-lg shadow-md animate-fade-in">
          ✅ Request Sent!
        </div>
      )}

      {/* ✅ Simple fade-in animation */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-5px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-5px); }
        }
        .animate-fade-in {
          animation: fadeInOut 2.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
