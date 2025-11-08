import prisma from "@/lib/client";
import Link from "next/link";
import BookCard from "../components/BookCard";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

interface SearchParams {
  search?: string;
}

export default async function BooksPage({ searchParams }: { searchParams: SearchParams }) {
  
  const session = await getServerSession(authOptions);
  const query = searchParams.search || "";

  const books = await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        {
          Author_Books: {
            some: { author: { name: { contains: query } } },
          },
        },
        {
          Book_Genres: {
            some: { genre: { name: { contains: query } } },
          },
        },
      ],
    },
    include: {
      Author_Books: { include: { author: true } },
      Book_Genres: { include: { genre: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

        <div className="md:w-2/5 p-6 rounded-2xl flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-gray-800">The Grand Library</h1>
          {isAdmin && (
            <Link
              href="/books/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-center font-medium hover:bg-blue-700 transition"
            >
              ➕ Create New Book
            </Link>
          )}

          <form action="/books" method="get" className="mb-8">
            <input
              type="text"
              name="search"
              defaultValue={query}
              placeholder="Search"
              className="w-full sm:w-1/2 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm"
            />
          </form>
        </div>

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
