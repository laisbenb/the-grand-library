import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { redirect } from "next/navigation";

interface DetailPageProps {
    params: {
        id: string;
    };
}

export default async function detailPage({ params }: DetailPageProps) {

    const session = await getServerSession(authOptions);
    const bookId = Number(params.id);

    const book = await prisma.book.findUnique({
        where: { id: bookId },
        include: {
        Author_Books: {
            include: { author: true },
          },
          Book_Genres: {
            include: { genre: true },
          },
        },
    });

    if (!book) return notFound();

    const isAdmin = session?.user?.role === 'ADMIN';
  
    return (
        <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{book.title}</h1>
        <Link
          href="/books"
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          ← Back to Books
        </Link>
      </div>

      <div className="space-y-2">
        <p className="text-gray-700">{book.description}</p>
        <p><strong>Published Year:</strong> {book.publishedYear}</p>

        <p>
          <strong>Authors:</strong>{" "}
          {book.Author_Books.map((ab) => ab.author.name).join(", ") || "Unknown"}
        </p>

        <p>
          <strong>Genres:</strong>{" "}
          {book.Book_Genres.map((bg) => bg.genre.name).join(", ") ||
            "Uncategorized"}
        </p>

        <p className="text-xs text-gray-400">
          Created at: {new Date(book.createdAt).toLocaleDateString()}
        </p>
      </div>

      {isAdmin && (
        <div className="flex gap-3 mt-6">
          <Link
            href={`/books/${book.id}/edit`}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
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
              Delete
            </button>
          </form>
        </div>
      )}
    </div>
    );
}