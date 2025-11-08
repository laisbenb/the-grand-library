import { redirect } from "next/navigation";

export const metadata = {
  title: "Welcome",
  description:
    "Explore your favorite books, manage your borrow requests, and discover new reads — all in one place.",
};

export default function Home() {
  redirect('/books');
  return (
    <h1>Welcome to the Grand Library</h1>
  );
}
