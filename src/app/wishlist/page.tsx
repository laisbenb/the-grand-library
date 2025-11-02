import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import Link from "next/link";
import Image from "next/image";
import { removeFromWishlist } from "./action";

export default async function WishListPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">You must be logged in to view your wishlist.</p>
      </div>
    );
  }

  const wishlist = await prisma.wishList.findMany({
    where: { userId: Number(session.user.id) },
    include: {
      book: {
        include: {
          Author_Books: { include: { author: true } },
          Book_Genres: { include: { genre: true } },
        },
      },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-500">You haven't added any books yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((entry) => (
            <div
              key={entry.id}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
            >
              {entry.book.coverImage && (
                <div className="relative w-full h-48 mb-3">
                  <Image
                    src={entry.book.coverImage}
                    alt={entry.book.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <Link href={`/books/${entry.book.id}`}>
                <h2 className="text-lg font-semibold">{entry.book.title}</h2>
              </Link>
              <p className="text-sm mt-1 text-gray-600">
                {entry.book.Author_Books.map((ab) => ab.author.name).join(", ")}
              </p>
              <form
                action={async () => {
                  "use server";
                  await removeFromWishlist(entry.book.id);
                }}
              >
                <button
                  type="submit"
                  className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
                >
                  Remove from Wishlist
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
