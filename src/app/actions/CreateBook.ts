"use server";

import prisma from "@/lib/client";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs/promises";

export async function createBook(data: FormData) {

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

export async function addAuthor(data: FormData) {
    
  const name = data.get("name")?.toString().trim();
  if (!name) throw new Error("Author name is required.");
  await prisma.author.create({ data: { name } });

  redirect("/books/new");
}

export async function addGenre(data: FormData) {

  const name = data.get("name")?.toString().trim();
  if (!name) throw new Error("Genre name is required.");
  await prisma.genre.create({ data: { name } });

  redirect("/books/new");
}