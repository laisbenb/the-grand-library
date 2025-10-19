import Link from "next/link";

export default function BooksPage() {
  return (
    <div className="flex">
      <div>
        <Link href="/books/new">Create New Book</Link>
      </div>
      <div>
        <h1>Books Page</h1>
      </div>
    </div>
);
}