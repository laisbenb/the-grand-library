"use server";

import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

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

export async function approveBorrow(requestId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const dueDate = new Date(now.getTime() + 1 * 60 * 1000); //7 * 24 * 60 * 60 * 1000


  await prisma.loan.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
      dueDate,
    },
  });

  revalidatePath("/admin");
}

export async function rejectBorrow(requestId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.loan.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
    },
  });

  revalidatePath("/admin");
}
