import { auth } from "@/auth";
import { SignInButton } from "@/components/auth/SignInButton";
import { UserAvatar } from "@/components/auth/UserAvatar";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
          </div>

          {session ? (
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
            >
              <UserAvatar
                name={session.user.name}
                image={session.user.image}
                size={32}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {session.user.name}
              </span>
            </Link>
          ) : (
            <SignInButton />
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Welcome to Claude Super Plan
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            A Next.js 16 application with Google OAuth authentication powered by
            NextAuth.js v5.
          </p>

          {!session && (
            <div className="mt-10">
              <SignInButton />
            </div>
          )}

          {session && (
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/profile"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                View Profile
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>

        <div className="mt-24 grid max-w-5xl gap-8 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Secure Authentication
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Google OAuth integration with NextAuth.js v5
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Protected Routes
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Middleware-based route protection with redirects
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              JWT Sessions
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Serverless-friendly session management for Vercel
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Built with Next.js 16 and NextAuth.js v5
        </div>
      </footer>
    </div>
  );
}
