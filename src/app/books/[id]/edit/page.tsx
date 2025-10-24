import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import { redirect, notFound } from "next/navigation";

interface EditBookPageProps {
  params: { id: string };
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const session = await getServerSession(authOptions);
  const bookId = Number(params.id);

  // Protect route: only ADMINs can edit
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/books");
  }

  // Fetch book + authors + genres
  const [book, authors, genres] = await Promise.all([
    prisma.book.findUnique({
      where: { id: bookId },
      include: {
        Author_Books: { include: { author: true } },
        Book_Genres: { include: { genre: true } },
      },
    }),
    prisma.author.findMany(),
    prisma.genre.findMany(),
  ]);

  if (!book) return notFound();

  // Existing selected ids
  const selectedAuthorIds = book.Author_Books.map((a) => a.authorId);
  const selectedGenreIds = book.Book_Genres.map((g) => g.genreId);

  // Server action to update the book
  async function updateBook(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const publishedYear = Number(formData.get("publishedYear"));
    const authorIds = formData.getAll("authorIds").map((id) => Number(id));
    const genreIds = formData.getAll("genreIds").map((id) => Number(id));

    // Update book
    await prisma.book.update({
      where: { id: bookId },
      data: {
        title,
        description,
        publishedYear,
        updatedAt: new Date(),

        // Update relations: remove old and connect new
        Author_Books: {
          deleteMany: {},
          create: authorIds.map((authorId) => ({ authorId })),
        },
        Book_Genres: {
          deleteMany: {},
          create: genreIds.map((genreId) => ({ genreId })),
        },
      },
    });

    redirect(`/books/${bookId}`);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Book</h1>

      <form action={updateBook} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={book.title}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            defaultValue={book.description}
            className="w-full border p-2 rounded h-24"
          />
        </div>

        {/* Published Year */}
        <div>
          <label className="block font-medium mb-1">Published Year</label>
          <input
            type="number"
            name="publishedYear"
            defaultValue={book.publishedYear}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Authors */}
        <div>
          <label className="block font-medium mb-1">Authors</label>
          <select
            name="authorIds"
            multiple
            className="w-full border p-2 rounded h-32"
          >
            {authors.map((author) => (
              <option
                key={author.id}
                value={author.id}
                selected={selectedAuthorIds.includes(author.id)}
              >
                {author.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Hold Ctrl (or Cmd) to select multiple authors
          </p>
        </div>

        {/* Genres */}
        <div>
          <label className="block font-medium mb-1">Genres</label>
          <select
            name="genreIds"
            multiple
            className="w-full border p-2 rounded h-32"
          >
            {genres.map((genre) => (
              <option
                key={genre.id}
                value={genre.id}
                selected={selectedGenreIds.includes(genre.id)}
              >
                {genre.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Hold Ctrl (or Cmd) to select multiple genres
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
