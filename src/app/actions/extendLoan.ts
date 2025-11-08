"use server";

import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function extendLoan(loanId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = Number(session.user.id);

  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
  });

  if (!loan) throw new Error("Loan not found");
  if (loan.userId !== userId) throw new Error("Not your loan");
  if (loan.extended) throw new Error("Loan already extended once");
  if (loan.status !== "APPROVED") throw new Error("Cannot extend inactive loan");
  if (!loan.dueDate) throw new Error("Missing due date");

  const newDueDate = new Date(loan.dueDate);
  newDueDate.setDate(newDueDate.getDate() + 7);

  await prisma.loan.update({
    where: { id: loanId },
    data: {
      dueDate: newDueDate,
      extended: true,
    },
  });

  revalidatePath(`/users/${loan.userId}`);
}