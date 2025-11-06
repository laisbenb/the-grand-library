"use server";

import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function approveBorrow(requestId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.loan.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
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
