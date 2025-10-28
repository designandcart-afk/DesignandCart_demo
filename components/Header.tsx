'use client';
import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { useState } from 'react';
import { Input } from './UI';

export default function Header() {
  const [q, setQ] = useState('');
  const email = typeof window !== 'undefined'
    ? localStorage.getItem('dc:userEmail') || 'demo@designandcart.in'
    : 'demo@designandcart.in';

  return (
    <header className="sticky top-0 z-50 bg-[#efeee9]/90 border-b backdrop-blur">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm border">
          <span className="inline-block w-3 h-3 rounded-full bg-[#d96857]" />
          <span className="font-semibold">Design&Cart</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-[15px]">
          <Link href="/">Dashboard</Link>
          <Link href="/products">Products</Link>
          <Link href="/chat">Chat</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/orders">Orders</Link>
          {/* Account is public */}
          <Link href="/account">Account</Link>
        </nav>

        {/* Search + Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-56 relative">
            <Input placeholder="Search..." value={q} onChange={(e)=>setQ(e.target.value)} />
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-black/50" />
          </div>
          <Link
            href="/account"
            className="hidden sm:flex items-center gap-2 bg-white border rounded-full px-3 py-1 hover:bg-black/5"
          >
            <User className="w-4 h-4 text-[#d96857]" />
            <span className="text-sm text-[#d96857]">{email}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
