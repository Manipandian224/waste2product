'use client';

import Link from 'next/link';
import { Leaf, User, ShoppingBag, BarChart3, Upload, LogOut, Menu, Home, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';

export function Navbar() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/');
  };

  const NavLinks = () => (
    <>
      <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-2 py-2 md:py-0">
        <BarChart3 className="w-4 h-4" /> Dashboard
      </Link>
      <Link href="/marketplace" className="hover:text-primary transition-colors flex items-center gap-2 py-2 md:py-0">
        <ShoppingBag className="w-4 h-4" /> Marketplace
      </Link>
      <Link href="/upload" className="hover:text-primary transition-colors flex items-center gap-2 py-2 md:py-0">
        <Upload className="w-4 h-4" /> Upload Waste
      </Link>
      <Link href="/pickup" className="hover:text-primary transition-colors flex items-center gap-2 py-2 md:py-0">
        <Truck className="w-4 h-4" /> Pickup
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 md:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-primary">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="glass border-r border-white/10 w-[280px]">
            <SheetHeader className="mb-8">
              <SheetTitle className="flex items-center gap-2 text-left">
                <Leaf className="w-5 h-5 text-primary" />
                <span className="font-headline font-bold">Waste<span className="text-primary">2</span>Product</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 text-lg font-medium">
              <SheetClose asChild>
                <Link href="/" className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                  <Home className="w-5 h-5" /> Home
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/dashboard" className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                  <BarChart3 className="w-5 h-5" /> Dashboard
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/marketplace" className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                  <ShoppingBag className="w-5 h-5" /> Marketplace
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/upload" className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                  <Upload className="w-5 h-5" /> Upload Waste
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/pickup" className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                  <Truck className="w-5 h-5" /> Schedule Pickup
                </Link>
              </SheetClose>
              {!user && (
                <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                  <SheetClose asChild>
                    <Link href="/login" className="text-primary font-bold" suppressHydrationWarning>Sign In</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild className="rounded-full bg-primary font-bold">
                      <Link href="/register" suppressHydrationWarning>Get Started</Link>
                    </Button>
                  </SheetClose>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight hidden xs:inline-block">
            Waste<span className="text-primary">2</span>Product
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <NavLinks />
      </div>

      <div className="flex items-center gap-3">
        {!isUserLoading && (
          user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-primary/20">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.displayName?.charAt(0) || <User className="w-5 h-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass border-white/10" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer" suppressHydrationWarning>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="hidden sm:flex rounded-full border-primary/20 hover:bg-primary/10">
                <Link href="/login" suppressHydrationWarning>
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button asChild size="sm" className="rounded-full px-4 md:px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-xs md:text-sm">
                <Link href="/register" suppressHydrationWarning>
                  Get Started
                </Link>
              </Button>
            </div>
          )
        )}
      </div>
    </nav>
  );
}
