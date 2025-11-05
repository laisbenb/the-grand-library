import { redirect } from "next/navigation";

export default function Home() {
  redirect('/books');
  return (
    <h1>Welcome to the Grand Library</h1>
  );
}
