import Link from "next/link";

export default function NavBar() {
  return (
    <nav>
        <div>
            <Link href="/">Home</Link>
        </div>
        <div>
            <Link href="/books">Books</Link>
            <Link href="/wishlist">Winkelmandje</Link>
            <Link href="/login">Login</Link>
        </div>
    </nav>
  );
  }