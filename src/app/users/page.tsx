import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/404");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">User Management</h1>

      {users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        
        <table className="min-w-full border border-gray-200 bg-white rounded-xl shadow-md overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Email</th>
              <th className="text-left py-3 px-4 font-semibold">Role</th>
              <th className="text-left py-3 px-4 font-semibold">Registered</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                 <Link key={user.id} href={`/users/${user.id}`} className="hover:text-orange-600 font-medium">
                <td className="py-3 px-4">{user.name}</td>
                </Link>
                <td className="py-3 px-4">{user.email}</td>
                <td
                  className={`py-3 px-4 font-medium ${
                    user.role === "ADMIN"
                      ? "text-orange-600"
                      : "text-gray-600"
                  }`}
                >
                  {user.role}
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}