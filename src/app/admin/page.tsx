import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import { redirect } from "next/navigation";
import { approveBorrow, rejectBorrow } from "./action";

export default async function AdminBorrowRequestsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const borrowRequests = await prisma.loan.findMany({
    include: {
      user: true,
      book: true,
    },
    orderBy: { requestedAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📚 Borrow Requests
      </h1>

      {borrowRequests.length === 0 ? (
        <p className="text-gray-500">No borrow requests yet.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          {borrowRequests.map((req) => (
            <div
              key={req.id}
              className="flex justify-between items-center border-b border-gray-200 pb-3"
            >
              <div>
                <p className="text-gray-800">
                  <strong>{req.user.name}</strong> requested to borrow{" "}
                  <strong>{req.book.title}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Requested on {new Date(req.requestedAt).toLocaleDateString()}
                </p>
                <p
                  className={`text-sm font-medium ${
                    req.status === "PENDING"
                      ? "text-orange-500"
                      : req.status === "APPROVED"
                      ? "text-green-600"
                      : req.status === "REJECTED"
                      ? "text-red-600"
                      : "text-gray-400"
                  }`}
                >
                  Status: {req.status}
                </p>
              </div>

              {req.status === "PENDING" && (
                <div className="flex gap-2">
                  <form action={approveBorrow.bind(null, req.id)}>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                      ✅ Approve
                    </button>
                  </form>

                  <form action={rejectBorrow.bind(null, req.id)}>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      ❌ Reject
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
