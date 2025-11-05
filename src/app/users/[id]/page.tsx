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

  const userId = Number(params.id);
  if (isNaN(userId)) return notFound();

  const isAdmin = session?.user?.role === "ADMIN";
  const isSelf = Number(session.user.id) === userId;


  if (!isAdmin && !isSelf) {
    redirect("/");
  }

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
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">
          User Details —{" "}
          <span className="text-orange-600">{user.name}</span>
        </h1>
        <Link
          href="/users"
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm font-medium transition"
        >
          ← Back to Users
        </Link>
      </div>

      {/* User Info Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          👤 Account Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong className="text-gray-800">📧 Email:</strong> {user.email}
          </p>
          <p>
            <strong className="text-gray-800">🗓️ Created:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong className="text-gray-800">🕒 Updated:</strong>{" "}
            {new Date(user.updatedAt).toLocaleDateString()}
          </p>
          <p>
            <strong className="text-gray-800">👑 Role:</strong>{" "}
            <span
              className={`font-semibold px-2 py-1 rounded-md ${
                user.role === "ADMIN"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {user.role}
            </span>
          </p>
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Wishlist
          </h2>
          <span className="bg-orange-500 text-white text-sm font-medium px-4 py-1.5 rounded-full">
            {wishlistedBooks.length}{" "}
            {wishlistedBooks.length === 1 ? "Book" : "Books"}
          </span>
        </div>

        {wishlistedBooks.length === 0 ? (
          <p className="text-gray-500 italic">
            This user hasn’t added any books to their wishlist yet.
          </p>
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
