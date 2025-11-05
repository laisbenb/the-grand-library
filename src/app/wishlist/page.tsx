import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import { removeFromWishlist } from "./action";
import BookCard from "../components/BookCard";

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
        <p className="text-gray-500">You have not added any books yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((entry) => (
            <BookCard
              key={entry.id}
              id={entry.book.id}
              title={entry.book.title}
              coverImage={entry.book.coverImage}
              authors={entry.book.Author_Books.map((a) => a.author.name)}
              genres={entry.book.Book_Genres.map((g) => g.genre.name)}
              publishedYear={entry.book.publishedYear}
              createdAt={entry.book.createdAt}
              showRemoveButton
              onRemove={async () => {
                "use server";
                await removeFromWishlist(entry.book.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
