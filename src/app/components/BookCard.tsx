import Image from "next/image";
import Link from "next/link";

interface BookCardProps {
  id: number;
  title: string;
  coverImage?: string | null;
  authors?: string[];
  genres?: string[];
  publishedYear?: number;
  createdAt?: Date;
  showRemoveButton?: boolean;
  onRemove?: () => Promise<void> | void;
}

export default function BookCard({
  id,
  title,
  coverImage,
  authors = [],
  genres = [],
  publishedYear,
  createdAt,
  showRemoveButton = false,
  onRemove,
}: BookCardProps) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-200">

      {coverImage ? (
        <div className="relative w-full h-64 mb-3">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg border border-gray-200">
          No Image
        </div>
      )}

      <div className="flex flex-col flex-grow">
        <Link href={`/books/${id}`}>
          <h2 className="text-lg font-semibold hover:text-orange-600 transition">
            {title}
          </h2>
        </Link>

        {authors.length > 0 && (
          <p className="text-sm text-gray-700 mt-1">
            <strong>By:</strong> {authors.join(", ")}
          </p>
        )}

        {genres.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            <strong>Genres:</strong> {genres.join(", ")}
          </p>
        )}

        {publishedYear && (
          <p className="text-sm text-gray-600 mt-1">
            <strong>Year:</strong> {publishedYear}
          </p>
        )}

        {createdAt && (
          <p className="text-xs text-gray-400 mt-2">
            Added on {new Date(createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
      {showRemoveButton && onRemove && (
        <form
          action={onRemove}
          className="mt-4"
        >
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
          >
            Remove from Wishlist
          </button>
        </form>
      )}
    </div>
  );
}