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
      className={`flex items-center gap-2 px-4 py-3 
              bg-exposeBrandBlue text-white shadow-md shadow-black
              font-semibold rounded-md cursor-pointer 
              hover:bg-pink-500 hover:text-white 
              transition-colors duration-200 ${className}`}
      style={style}
    >
      {children}
    </Link>
  );
}

export default SidebarLink;
