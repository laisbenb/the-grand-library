"use server";

import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function returnBook(loanId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = Number(session.user.id);

  const loan = await prisma.loan.findUnique({ where: { id: loanId } });
  if (!loan || loan.userId !== userId) {
    throw new Error("Unauthorized or invalid loan");
  }

  await prisma.loan.update({
    where: { id: loanId },
    data: {
      status: "RETURNED",
      returnedAt: new Date(),
    },
  });

  revalidatePath(`/users/${userId}`);
}
