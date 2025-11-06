"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/client";

export async function requestBorrow(bookId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not authenticated");

  const userId = Number(session.user.id);

  const existingBorrow = await prisma.loan.findFirst({
    where: {
      bookId,
      status: "APPROVED",
    },
  });

  if (existingBorrow) throw new Error("Book is already borrowed.");
  
  const existingRequest = await prisma.loan.findFirst({
    where: {
      bookId,
      userId,
      status: "PENDING",
    },
  });

  if (existingRequest) throw new Error("You already requested this book.");

  await prisma.loan.create({
    data: {
      userId,
      bookId,
    },
  });
}
