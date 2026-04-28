import Link from "next/link";

function SidebarLink({
  href,
  children,
  setSidebarOpen,
  className = "",
  style,
}: {
  href: string;
  children: React.ReactNode;
  setSidebarOpen: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties; // 👈 esto habilita la prop style
}) {
  return (
    <Link
      href={href}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center gap-2 hover:bg-gray-800 rounded-md transition ${className}`}
      style={style}
    >
      {children}
    </Link>
  );
}

export default SidebarLink;
