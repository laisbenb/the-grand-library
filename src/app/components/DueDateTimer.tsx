"use client";

import { useEffect, useState } from "react";

interface DueDateTimerProps {
  dueDate: string | Date;
}

export default function DueDateTimer({ dueDate }: DueDateTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(dueDate).getTime();
      const distance = end - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m ${seconds}s`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [dueDate]);

  if (timeLeft === "Expired") return null;

  return (
    <div className="mt-4 text-sm font-medium text-gray-700 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 inline-block">
      ⏰ Time left: <span className="text-orange-600">{timeLeft}</span>
    </div>
  );
}
