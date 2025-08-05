import Link from "next/link";
import { LayoutGrid, Package, ListTodo } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col p-4">
      {/* SidebarHeader removed temporarily */}
      {/* SidebarContent */}
      <nav className="flex flex-col gap-1 flex-1">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#1a202c] text-sm font-normal px-3 py-2 rounded hover:bg-gray-100 hover:text-black transition-colors"
        >
          <LayoutGrid className="h-4 w-4 text-[#1a202c]" strokeWidth={2} />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/produtos"
          className="flex items-center gap-2 text-[#1a202c] text-sm font-normal px-3 py-2 rounded hover:bg-gray-100 hover:text-black transition-colors"
        >
          <Package className="h-4 w-4 text-[#1a202c]" strokeWidth={2} />
          <span>Produtos</span>
        </Link>
        <Link
          href="/tarefas"
          className="flex items-center gap-2 text-[#1a202c] text-sm font-normal px-3 py-2 rounded hover:bg-gray-100 hover:text-black transition-colors"
        >
          <ListTodo className="h-4 w-4 text-[#1a202c]" strokeWidth={2} />
          <span>Tarefas</span>
        </Link>
      </nav>
    </aside>
  );
}
