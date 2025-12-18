import { SignOutButton } from "@/components/auth/SignOutButton";
import Link from "next/link";

export default function SignOutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Sign Out
        </h2>
        <p className="text-gray-600">
          Are you sure you want to sign out?
        </p>

        <div className="space-y-4">
          <SignOutButton className="w-full" />
          <Link
            href="/"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
