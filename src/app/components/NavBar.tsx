"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function NavBar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white/90 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-xl font-bold text-orange-600 hover:text-orange-700 transition"
        >
          📚 The Grand Library
        </Link>

        <Link
          href="/books"
          className="text-gray-700 hover:text-orange-600 font-medium transition"
        >
          Books
        </Link>

        {isAdmin && (
          <Link
            href="/users"
            className="text-gray-700 hover:text-orange-600 font-medium transition"
          >
            Users
          </Link>
        )}
      </div>

      <div className="relative">
        {!session ? (
          <Link
            href="/signin"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
          >
            Login
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 text-gray-800 font-medium hover:text-orange-600 transition"
            >
              {user?.name || "Profile"}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                onMouseLeave={closeDropdown}
              >
                <Link
                  href={`/users/${user?.id}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                  onClick={closeDropdown}
                >
                  My Profile
                </Link>

                <Link
                  href="/wishlist"
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                  onClick={closeDropdown}
                >
                  My Wishlist
                </Link>

                <Link
                  href="/signout"
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                  onClick={closeDropdown}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
