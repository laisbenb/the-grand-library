"use client";

import { useTransition } from "react";
import { requestBorrow } from "@/app/actions/Borrow";
import toast from "react-hot-toast";

export default function BorrowButton({
  bookId,
  isBorrowed,
}: {
  bookId: number;
  isBorrowed: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleBorrow = () => {
    if (isBorrowed) {
      toast.error("❌ This book is already borrowed by another user.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await requestBorrow(bookId);

        if (result?.error === "already-borrowed") {
          toast.error("⚠️ This book is already borrowed by another user.");
          return;
        }

        if (result?.success) {
          toast.success("✅ Borrow request sent successfully!");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <button
      onClick={handleBorrow}
      disabled={isBorrowed || isPending}
      className={`px-4 py-2 rounded text-white transition ${
        isBorrowed
          ? "bg-gray-400 cursor-not-allowed"
          : isPending
          ? "bg-gray-500 cursor-wait"
          : "bg-orange-500 hover:bg-orange-600"
      }`}
    >
      {isBorrowed
        ? "📚 Already Borrowed"
        : isPending
        ? "⏳ Sending..."
        : "📖 Borrow Book"}
    </button>
  );
}
