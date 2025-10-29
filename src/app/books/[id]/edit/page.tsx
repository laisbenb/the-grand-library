import prisma from "@/lib/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import path from "path";
import fs from "fs/promises";

interface EditBookPageProps {
  params: { id: string };
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/404");
  }

  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      Author_Books: { include: { author: true } },
      Book_Genres: { include: { genre: true } },
    },
  });

  if (!book) notFound();

  const authors = await prisma.author.findMany({ orderBy: { name: "asc" } });
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

  const currentAuthorId = book.Author_Books[0]?.authorId || "";
  const currentGenreId = book.Book_Genres[0]?.genreId || "";

  async function updateBook(formData: FormData) {
    "use server";

    const title = formData.get("title")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const publishedYearStr = formData.get("publishedYear")?.toString() ?? "";
    const authorIdStr = formData.get("authorId")?.toString() ?? "";
    const genreIdStr = formData.get("genreId")?.toString() ?? "";

    const file = formData.get("coverImage") as File | null;

    if (!title || !description || !publishedYearStr || !authorIdStr || !genreIdStr) {
      throw new Error("All fields are required");
    }

    const publishedYear = parseInt(publishedYearStr, 10);
    const authorId = parseInt(authorIdStr, 10);
    const genreId = parseInt(genreIdStr, 10);

    let coverImagePath = book.coverImage;

    // Handle new file upload if provided
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileExt = path.extname(file.name);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExt}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");

      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      // Remove old cover image if it exists
      if (book.coverImage) {
        const oldPath = path.join(process.cwd(), "public", book.coverImage);
        try {
          await fs.unlink(oldPath);
        } catch {
          console.warn("Old image not found, skipping delete.");
        }
      }

      coverImagePath = `/uploads/${fileName}`;
    }

    // Update the book
    await prisma.book.update({
      where: { id: book.id },
      data: {
        title,
        description,
        publishedYear,
        coverImage: coverImagePath,
        Author_Books: {
          deleteMany: {}, // remove existing relation
          create: { authorId },
        },
        Book_Genres: {
          deleteMany: {},
          create: { genreId },
        },
      },
    });

    redirect(`/books/${book.id}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Edit Book: {book.title}</h1>

      <form action={updateBook} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            type="text"
            defaultValue={book.title}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={book.description}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Published Year</label>
          <input
            name="publishedYear"
            type="number"
            defaultValue={book.publishedYear}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Author</label>
          <select
            name="authorId"
            defaultValue={currentAuthorId}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Genre</label>
          <select
            name="genreId"
            defaultValue={currentGenreId}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Replace Cover Image (optional)</label>
          <input
            type="file"
            name="coverImage"
            accept="image/png, image/jpeg"
            className="w-full"
          />
          {book.coverImage && (
            <p className="text-sm text-gray-500 mt-1">
              Current image: <code>{book.coverImage}</code>
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
