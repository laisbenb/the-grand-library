"use server";

import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function requestBorrow(bookId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "unauthorized" };
  }

  const userId = Number(session.user.id);

  // Check if the book is already borrowed
  const existingBorrow = await prisma.loan.findFirst({
    where: {
      bookId,
      status: "APPROVED",
    },
  });

  if (existingBorrow) {
    return { error: "already-borrowed" };
  }

  // Check if the same user already has a pending request
  const existingRequest = await prisma.loan.findFirst({
    where: {
      bookId,
      userId,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    return { error: "already-requested" };
  }

  // Create a new pending borrow request
  await prisma.loan.create({
    data: {
      userId,
      bookId,
    },
  });

  revalidatePath(`/books/${bookId}`);

  return { success: true };
}

export async function approveBorrow(requestId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "unauthorized" };
  }

  const now = new Date();
  const dueDate = new Date(now.getTime() + 1 * 60 * 1000); // ⏱️ currently 1 minute for testing

  await prisma.loan.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
      approvedAt: now,
      dueDate,
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function rejectBorrow(requestId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "unauthorized" };
  }

  await prisma.loan.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
    },
  });

  revalidatePath("/admin");
  return { success: true };
}
