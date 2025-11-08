"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(bookId: number) {
  
  const session = await getServerSession(authOptions);
  if (!session?.user) return;

  const userId = Number(session.user.id);
  if (isNaN(userId)) throw new Error("Invalid user ID");

  const existing = await prisma.wishList.findUnique({
    where: { userId_bookId: { userId, bookId } },
  });

  if (existing) {
    await prisma.wishList.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.wishList.create({
      data: { userId, bookId },
    });
  }

  revalidatePath(`/books/${bookId}`);
}

export async function removeFromWishlist(bookId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return;

  const userId = Number(session.user.id);

  await prisma.wishList.deleteMany({
    where: { userId, bookId },
  });

  revalidatePath("/wishlist");
}