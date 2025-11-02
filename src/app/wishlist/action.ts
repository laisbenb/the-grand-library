"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import { revalidatePath } from "next/cache";

export async function removeFromWishlist(bookId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return;

  const userId = Number(session.user.id); // convert string → number

  await prisma.wishList.deleteMany({
    where: { userId, bookId },
  });

  revalidatePath("/wishlist"); // refresh the wishlist page
}
