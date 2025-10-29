import prisma from "@/lib/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import path from "path";
import fs from "fs/promises";
import Image from "next/image";

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

    // handle image upload
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileExt = path.extname(file.name);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExt}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");

      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      // delete old image if exists
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

    await prisma.book.update({
      where: { id: book.id },
      data: {
        title,
        description,
        publishedYear,
        coverImage: coverImagePath,
        Author_Books: {
          deleteMany: {},
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
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        ✏️ Edit Book
      </h1>

      <form action={updateBook} className="form-card">
        {/* Title */}
        <div>
          <label className="label">Title</label>
          <input
            name="title"
            type="text"
            defaultValue={book.title}
            required
            className="input-field"
          />
        </div>

        {/* Description */}
        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={book.description}
            required
            className="input-field"
          />
        </div>

        {/* Published Year */}
        <div>
          <label className="label">Published Year</label>
          <input
            name="publishedYear"
            type="number"
            defaultValue={book.publishedYear}
            required
            className="input-field"
          />
        </div>

        {/* Author */}
        <div>
          <label className="label">Author</label>
          <select
            name="authorId"
            defaultValue={currentAuthorId}
            required
            className="input-field bg-white"
          >
            <option value="">Select author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        {/* Genre */}
        <div>
          <label className="label">Genre</label>
          <select
            name="genreId"
            defaultValue={currentGenreId}
            required
            className="input-field bg-white"
          >
            <option value="">Select genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cover Image */}
        <div className="upload-box">
          <label className="label">📚 Cover Image</label>

          {book.coverImage ? (
            <div className="flex flex-col items-center mb-4">
              <Image
                src={book.coverImage}
                alt={`${book.title} cover`}
                width={150}
                height={220}
                className="rounded-md shadow-sm object-cover"
              />
              <p className="text-sm text-gray-500 mt-2">
                Current cover image — upload a new one to replace it.
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic mb-2">No cover image uploaded yet.</p>
          )}

          <div className="flex flex-col items-center justify-center border border-gray-300 bg-white rounded-lg py-6 hover:bg-gray-100 transition cursor-pointer">
            <input
              type="file"
              name="coverImage"
              accept="image/png, image/jpeg"
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-500 mt-2">
              Drag & drop or click to upload (JPG/PNG)
            </p>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="submit-btn">
          💾 Save Changes
        </button>
      </form>
    </div>
  );
}
