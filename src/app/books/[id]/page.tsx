import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";

interface DetailPageProps {
  params: {
    id: string;
  };
}

// 🔹 Server action to toggle wishlist
async function toggleWishlist(bookId: number) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user) return;

  // ✅ Convert string → number
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

export default async function BookDetailPage({ params }: DetailPageProps) {
  const session = await getServerSession(authOptions);
  const bookId = Number(params.id);

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      Author_Books: { include: { author: true } },
      Book_Genres: { include: { genre: true } },
      WishList: true, // ✅ So we can check if the current user has this book wishlisted
    },
  });

  if (!book) return notFound();

  const isAdmin = session?.user?.role === "ADMIN";
  const userId = session?.user?.id;
  const isWishlisted = book.WishList?.some((w) => w.userId === userId);

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Back Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
        <Link
          href="/books"
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm transition"
        >
          ← Back to Books
        </Link>
      </div>

      {/* Book Layout */}
      <div className="flex flex-col md:flex-row gap-10 bg-white p-6 rounded-2xl shadow-lg">
        {/* Cover Image */}
        <div className="flex-shrink-0">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={`${book.title} cover`}
              width={350}
              height={500}
              className="rounded-lg shadow-md object-cover w-[300px] h-[450px]"
            />
          ) : (
            <div className="w-[300px] h-[450px] flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg border border-gray-200">
              No Cover Image
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {book.title}
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {book.description}
            </p>

            <div className="space-y-2 text-gray-700">
              <p>
                <strong>📅 Published Year:</strong> {book.publishedYear}
              </p>
              <p>
                <strong>✍️ Author:</strong>{" "}
                {book.Author_Books.map((ab) => ab.author.name).join(", ") ||
                  "Unknown"}
              </p>
              <p>
                <strong>🏷️ Genre:</strong>{" "}
                {book.Book_Genres.map((bg) => bg.genre.name).join(", ") ||
                  "Uncategorized"}
              </p>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Added on {new Date(book.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            {/* 🔸 Wishlist Button */}
            {session?.user && (
              <form action={toggleWishlist.bind(null, book.id)}>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded transition ${
                    isWishlisted
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {isWishlisted ? "💔 Remove from Wishlist" : "❤️ Add to Wishlist"}
                </button>
              </form>
            )}

            {/* Admin Controls */}
            {isAdmin && (
              <>
                <Link
                  href={`/books/${book.id}/edit`}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  ✏️ Edit
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await prisma.book.delete({ where: { id: book.id } });
                    redirect("/books");
                  }}
                >
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    🗑️ Delete
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
