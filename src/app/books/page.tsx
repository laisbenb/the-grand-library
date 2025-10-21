import prisma from "@/lib/client";
import Link from "next/link";

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    include: {
      Author_Books: {
        include: {
          author: true,
        },
      },
      Book_Genres: {
        include: {
          genre: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className=" flex justify-center gap-6">
      <div>
        <h1>Books</h1>
        <Link href="/books/new">
          Create New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <p className="text-gray-500">No books found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{book.title}</h2>

              <p className="mt-2 text-sm">
                <strong>Year:</strong> {book.publishedYear}
              </p>
              <p className="mt-1 text-sm">
                <strong>Genres:</strong>{" "}
                {book.Book_Genres.map((bg) => bg.genre.name).join(", ") ||
                  "Uncategorized"}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                Added on {new Date(book.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
