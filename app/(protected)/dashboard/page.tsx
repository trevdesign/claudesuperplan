import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link
            href="/profile"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View Profile →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Welcome</h3>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {session.user.name}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
            <p className="mt-2 text-2xl font-bold text-green-600">Active</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Provider</h3>
            <p className="mt-2 text-2xl font-bold text-gray-900">Google</p>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-8 shadow">
          <h2 className="text-xl font-semibold text-gray-900">
            Protected Content
          </h2>
          <p className="mt-2 text-gray-600">
            This page is only accessible to authenticated users.
          </p>
        </div>
      </div>
    </div>
  );
}
