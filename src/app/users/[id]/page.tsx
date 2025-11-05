import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

interface UserDetailPageProps {
  params: {
    id: string;
  };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const session = await getServerSession(authOptions);

  // 🔒 Only admins can access
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const userId = Number(params.id);
  if (isNaN(userId)) return notFound();

  // ✅ Fetch user data (you could include wishlist or books later)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      WishList: {
        include: {
          book: true,
        },
      },
    },
  });

  if (!user) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          User Details: {user.name}
        </h1>
        <Link
          href="/users"
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm transition"
        >
          ← Back to Users
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div className="space-y-2">
          <p>
            <strong className="text-gray-700">📧 Email:</strong> {user.email}
          </p>
          <p>
            <strong className="text-gray-700">👤 Role:</strong>{" "}
            <span
              className={`font-medium ${
                user.role === "ADMIN" ? "text-orange-600" : "text-gray-600"
              }`}
            >
              {user.role}
            </span>
          </p>
          <p>
            <strong className="text-gray-700">🗓️ Created:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong className="text-gray-700">🕒 Updated:</strong>{" "}
            {new Date(user.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Wishlist section (optional for now) */}
        {user.WishList.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Wishlist
            </h2>
            <ul className="space-y-2">
              {user.WishList.map((wl) => (
                <li
                  key={wl.id}
                  className="flex justify-between items-center border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition"
                >
                  <Link
                    href={`/books/${wl.book.id}`}
                    className="text-orange-600 font-medium hover:underline"
                  >
                    {wl.book.title}
                  </Link>
                  <span className="text-sm text-gray-500">
                    Added {new Date(wl.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
