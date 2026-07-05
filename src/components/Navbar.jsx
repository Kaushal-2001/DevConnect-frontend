import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";

export function Navbar({ loggedIn = false, user = null }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6 lg:px-8">
        <a href="/" className="shrink-0 text-lg font-bold tracking-tight text-neutral-900">
          DevConnect
        </a>

        <div className="relative hidden flex-1 max-w-md sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9"
          />
        </div>

        <div className="flex-1 sm:hidden" />

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {loggedIn ? (
            <button className="rounded-full ring-offset-2 transition hover:ring-2 hover:ring-neutral-200">
              <Avatar>
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{user?.initials}</AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <>
              <Button variant="ghost" size="sm">
                Log in
              </Button>
              <Button size="sm">Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}