# Book Library Web App

## Introduction
This is a modern web application for managing books, wishlists, and borrowing requests. It allows users to browse books, add them to their wishlist, request to borrow books, and track borrow status. Admins can manage users, approve or reject borrow requests, and add or edit books. The app is built with **Next.js 13**, **TypeScript**, **Tailwind CSS**, and **Prisma** for database management. Authentication and authorization are handled via **NextAuth.js**.

---

## Installation
1. **Clone the repository:**
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```
2. **Install dependecies:**
```bash
npm install
```
3. **Set up environment variables:**
Create a .env file in the root directory with your database URL and NextAuth secret:
```bash
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret-key"
```
4. **Run database migrations:**
```bash
npx prisma migrate dev
```
5.  **Start the development server:**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Feature Overview
* User Authentication & Authorization
    - Users can sign up, log in, and log out.
    - Admins have special privileges to manage users and books.
* Book Management
    - Book Management
    - Add, edit, and delete books (Admin only).
    - Support for multiple authors and genres per book.
    - Display detailed book pages with cover image, authors, genres, and published year.
* Wishlists
    - Users can add/remove books from their wishlist.
    - Display wishlist on user profile.
* Borrowing System
    - Users can request to borrow books.
    - Admin approval/rejection for borrow requests.
    - Users can track borrowed books and extend borrow once.
    - Automatic borrow due dates with countdown timers.
* User Management
    - Admins can view a list of users.
    - Detail pages showing wishlists and borrowed books.
    - Only accessible to admins or the user themselves.
* UI & UX
    - Responsive design using Tailwind CSS.
    - Loading states, toasts, and popups for better user experience.
    - SEO-friendly titles per page.
## Author
**Lais Ben Belgacem**\
Email: laith.benbelgacem@gmail.com\
Github: [laisbenb](https://github.com/laisbenb)

Thank you for checking out this project! It was built with love and care, focusing on modern React and Next.js features.