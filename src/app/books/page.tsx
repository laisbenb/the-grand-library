import prisma from "@/lib/client";
import Link from "next/link";
import BookCard from "../components/BookCard";

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    include: {
      Author_Books: { include: { author: true } },
      Book_Genres: { include: { genre: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Panel - 40% */}
        <div className="md:w-2/5 p-6 rounded-2xl flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-gray-800">The Grand Library</h1>
          <Link
            href="/books/new"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-center font-medium hover:bg-blue-700 transition"
          >
            ➕ Create New Book
          </Link>

          {/* Placeholder for filters/search */}
          <div className="mt-6 space-y-4">
            <p className="text-gray-500">Filters and search options coming soon...</p>
          </div>
        </div>

        {/* Right Panel - 60% */}
        <div className="md:w-3/5 flex flex-col gap-6">
          {books.length === 0 ? (
            <p className="text-gray-500">No books found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {books.map((book) => (
                <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                coverImage={book.coverImage}
                authors={book.Author_Books.map((a) => a.author.name)}
                genres={book.Book_Genres.map((g) => g.genre.name)}
                publishedYear={book.publishedYear}
                createdAt={book.createdAt}
              /> 
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
