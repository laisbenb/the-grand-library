import Link from "next/link";

export default function LoginPage() {
    return (
        <div>
            <h1>Login Page</h1>
            <form action="/login" method="POST">
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Login</button>
            </form>
            <Link href="/register">Maak een nieuw account aan</Link>
        </div>
    );
}