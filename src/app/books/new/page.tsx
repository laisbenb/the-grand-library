import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";


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

    return (
        <div>
            <h1>Create a New Book</h1>
        </div>
    );
}