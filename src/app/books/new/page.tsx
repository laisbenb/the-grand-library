import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs/promises";

export default async function NewBookPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/404");
  }

  const authors = await prisma.author.findMany({ orderBy: { name: "asc" } });
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

  async function addAuthor(data: FormData) {
    "use server";
    const name = data.get("name")?.toString().trim();
    if (!name) throw new Error("Author name is required.");
    await prisma.author.create({ data: { name } });
    redirect("/books/new");
  }

  async function addGenre(data: FormData) {
    "use server";
    const name = data.get("name")?.toString().trim();
    if (!name) throw new Error("Genre name is required.");
    await prisma.genre.create({ data: { name } });
    redirect("/books/new");
  }

  async function createBook(data: FormData) {
    "use server";

    const title = data.get("title")?.toString();
    const description = data.get("description")?.toString();
    const publishedYearStr = data.get("publishedYear")?.toString();
    const authorIdStr = data.get("authorId")?.toString();
    const genreIdStr = data.get("genreId")?.toString();

    const file = data.get("coverImage") as File | null;
    let coverImagePath: string | null = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileExt = path.extname(file.name);
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}${fileExt}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const filePath = path.join(uploadDir, fileName);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);

      coverImagePath = `/uploads/${fileName}`;
    }

    if (!title || !description || !publishedYearStr || !authorIdStr || !genreIdStr) {
      throw new Error("All fields are required");
    }

    const publishedYear = parseInt(publishedYearStr, 10);
    const authorId = parseInt(authorIdStr, 10);
    const genreId = parseInt(genreIdStr, 10);

    if (isNaN(publishedYear)) throw new Error("Invalid year.");

    await prisma.book.create({
      data: {
        title,
        description,
        publishedYear,
        coverImage: coverImagePath,
        Author_Books: { create: { authorId } },
        Book_Genres: { create: { genreId } },
      },
    });

    redirect("/books");
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📚 Admin: Manage Books, Authors & Genres
      </h1>

      {/* Add Author */}
      <div className="form-card">
        <h2 className="text-xl font-semibold mb-2">Add New Author</h2>
        <form action={addAuthor} className="flex gap-2">
          <input
            name="name"
            placeholder="Author name"
            className="flex-1 input-field"
            required
          />
          <button
            type="submit"
            className="small-btn bg-green-600 hover:bg-green-700"
          >
            ➕ Add
          </button>
        </form>
      </div>

      {/* Add Genre */}
      <div className="form-card">
        <h2 className="text-xl font-semibold mb-2">Add New Genre</h2>
        <form action={addGenre} className="flex gap-2">
          <input
            name="name"
            placeholder="Genre name"
            className="flex-1 input-field"
            required
          />
          <button
            type="submit"
            className="small-btn bg-purple-600 hover:bg-purple-700"
          >
            ➕ Add
          </button>
        </form>
      </div>

      {/* Create Book */}
      <div className="form-card">
        <h2 className="text-xl font-semibold mb-4">Create a New Book</h2>
        <form action={createBook} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input name="title" type="text" required className="input-field" />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              rows={3}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Published Year</label>
            <input
              name="publishedYear"
              type="number"
              required
              className="input-field"
            />
          </div>

          <div className="upload-box">
            <label className="label">📁 Cover Image (JPG or PNG)</label>
            <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg hover:bg-gray-100 transition cursor-pointer">
              <input
                type="file"
                name="coverImage"
                accept="image/png, image/jpeg"
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500 mt-2">
                Drag & drop or click to upload
              </p>
            </div>
          </div>

          <div>
            <label className="label">Author</label>
            <select name="authorId" required className="input-field bg-white">
              <option value="">Select author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Genre</label>
            <select name="genreId" required className="input-field bg-white">
              <option value="">Select genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn">
            📘 Add Book
          </button>
        </form>
      </div>
    </div>
  );
}
