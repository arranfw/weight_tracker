import type { ReactNode } from "react";
import { auth } from "@/auth";
import Link from "next/link";
import WeightUnitSelector from "@/components/WeightUnitSelector";

export default async function DashboardLayout({
  children,
}: { children: ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <nav className="bg-card shadow-xs">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="font-semibold text-xl text-indigo-600">
            Weight Tracker
          </Link>

          <div className="flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  {session.user.name || session.user.email}
                </div>
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main>
        {session?.user && (
          <div className="container mx-auto px-4 py-3 flex justify-end">
            <WeightUnitSelector />
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
