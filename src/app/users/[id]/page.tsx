import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import BookCard from "../../components/BookCard";

interface UserDetailPageProps {
  params: {
    id: string;
  };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const session = await getServerSession(authOptions);

  // 🔒 Only admins can access
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const userId = Number(params.id);
  if (isNaN(userId)) return notFound();

  // ✅ Fetch user data (you could include wishlist or books later)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      WishList: {
        include: {
          book: {
            include: {
              Author_Books: { include: { author: true } },
              Book_Genres: { include: { genre: true } },
            },
          },
        },
      },
    },
  });

  if (!user) return notFound();

  const wishlistedBooks = user.WishList.map((w) => w.book);

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          User Details: {user.name}
        </h1>
        <Link
          href="/users"
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm transition"
        >
          ← Back to Users
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div className="space-y-2">
          <p>
            <strong className="text-gray-700">📧 Email:</strong> {user.email}
          </p>
          <p>
            <strong className="text-gray-700">👤 Role:</strong>{" "}
            <span
              className={`font-medium ${
                user.role === "ADMIN" ? "text-orange-600" : "text-gray-600"
              }`}
            >
              {user.role}
            </span>
          </p>
          <p>
            <strong className="text-gray-700">🗓️ Created:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong className="text-gray-700">🕒 Updated:</strong>{" "}
            {new Date(user.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
         {/* Wishlist Section */}
      <div className="bg-white shadow-md p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Wishlist ({wishlistedBooks.length})
        </h2>

        {wishlistedBooks.length === 0 ? (
          <p className="text-gray-500">This user has no wishlisted books.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedBooks.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                coverImage={book.coverImage}
                authors={book.Author_Books.map((ab) => ab.author.name)}
                genres={book.Book_Genres.map((bg) => bg.genre.name)}
                publishedYear={book.publishedYear}
                createdAt={book.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
