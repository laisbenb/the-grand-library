import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { parse } from "path";


export default async function NewBookPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
        return (
            <div>
                <h1>Access Denied</h1>
                <p>You do not have permission to create a new book.</p>
            </div>
        );
    }

    const authors = await prisma.author.findMany({ orderBy: { name: 'asc' } });
    const genres = await prisma.genre.findMany({ orderBy: { name: 'asc' } });

    async function addAuthor(data: FormData) {
        'use server';

        const name = data.get('name')?.toString().trim();
        if (!name) throw new Error('Author naam is verplicht.');

        await prisma.author.create({ data: { name } });
        redirect('/books/new');
    }

    async function addGenre(data: FormData) {
        'use server';

        const name = data.get('name')?.toString().trim();
        if (!name) throw new Error('Genre naam is verplicht.');

        await prisma.genre.create({ data: { name } });
        redirect('/books/new');
    }

    async function createBook(data: FormData) {
        'use server';

        const title = data.get('title')?.toString();
        const description = data.get('description')?.toString();
        const publishedYearStr = data.get('publishedYear')?.toString();
        const authorIdStr = data.get('authorId')?.toString();
        const genreIdStr = data.get('genreId')?.toString();

        if (!title || !description || !publishedYearStr || !authorIdStr || !genreIdStr) {
            throw new Error('All fields are required');
        }

        const publishedYear = parseInt(publishedYearStr, 10);
        const authorId = parseInt(authorIdStr, 10);
        const genreId = parseInt(genreIdStr, 10);

        if (isNaN(publishedYear)) throw new Error("Invalid year.");

        const book = await prisma.book.create({
            data: {
                title,
                description,
                publishedYear,
                Author_Books: { create : { authorId } },
                Book_Genres: { create : { genreId } }
            }
        });

        redirect('/books');
    }

    return (
       <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin: Add Books, Authors, Genres</h1>

      {/* Add Author Form */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Add New Author</h2>
        <form action={addAuthor} className="flex gap-2">
          <input
            name="name"
            placeholder="Author name"
            className="flex-1 border border-gray-300 rounded-md p-2"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
          >
            Add
          </button>
        </form>
      </div>

      {/* Add Genre Form */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Add New Genre</h2>
        <form action={addGenre} className="flex gap-2">
          <input
            name="name"
            placeholder="Genre name"
            className="flex-1 border border-gray-300 rounded-md p-2"
            required
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700"
          >
            Add
          </button>
        </form>
      </div>

      {/* Create Book Form */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create a New Book</h2>
        <form action={createBook} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              name="title"
              type="text"
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Published Year</label>
            <input
              name="publishedYear"
              type="number"
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Dropdown for Authors */}
          <div>
            <label className="block font-medium mb-1">Author</label>
            <select
              name="authorId"
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

          {/* Dropdown for Genres */}
          <div>
            <label className="block font-medium mb-1">Genre</label>
            <select
              name="genreId"
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

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
}