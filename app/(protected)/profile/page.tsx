import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { SignOutButton } from "@/components/auth/SignOutButton";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?callbackUrl=/profile");
  }

  const { name, email, image } = session.user;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-12">
            <div className="flex flex-col items-center">
              <UserAvatar name={name} image={image} size={96} />
              <h2 className="mt-4 text-2xl font-bold text-white">
                {name || "Anonymous User"}
              </h2>
              <p className="mt-1 text-blue-100">{email}</p>
            </div>
          </div>

          <div className="px-6 py-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Account Information
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {name || "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Authentication Provider</dt>
                <dd className="mt-1 text-sm text-gray-900">Google</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <SignOutButton className="w-full sm:w-auto" />
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-3 font-semibold text-gray-900">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Go to Dashboard →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
