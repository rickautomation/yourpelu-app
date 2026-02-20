import Link from "next/link";

function SidebarLink({
  href,
  children,
  setSidebarOpen,
}: {
  href: string;
  children: React.ReactNode;
  setSidebarOpen: (open: boolean) => void;
}) {
  return (
    <Link
      href={href}
      onClick={() => setSidebarOpen(false)}
      className="flex items-center gap-2 hover:bg-gray-800 rounded-md transition"
    >
      {children}
    </Link>
  );
}

export default SidebarLink;