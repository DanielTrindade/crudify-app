"use client"

import React, { useEffect, useState } from 'react';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    const result = await signOut({ redirect: false, callbackUrl: "/login" });
    router.push(result.url);
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="text-2xl font-bold text-primary">Crudify</div>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        {session && (
          <Button variant="destructive" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;