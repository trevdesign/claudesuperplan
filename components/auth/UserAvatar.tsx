import Image from "next/image";

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  size?: number;
}

export function UserAvatar({ name, image, size = 40 }: UserAvatarProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name || "User avatar"}
        width={size}
        height={size}
        className="rounded-full"
      />
    );
  }

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <div
      className="flex items-center justify-center rounded-full bg-blue-600 font-semibold text-white"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}
