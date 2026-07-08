import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Code2 } from "lucide-react";
import { useSelector } from "react-redux";

export function Navbar() {
  const user = useSelector((store) => store.user);
  console.log(user);
  const loggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-6 lg:px-8">
        <a
          href="/"
          className="flex shrink-0 items-center gap-2 text-foreground"
        >
          <Code2 className="h-5 w-5" />
          <span className="text-lg font-bold tracking-tight">DevConnect</span>
        </a>

        <div className="relative hidden flex-1 max-w-md sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="pl-9" />
        </div>

        <div className="flex-1 sm:hidden" />

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {loggedIn ? (
            <>
              <span className="text-sm font-medium">
                Welcome, {user?.firstName}
              </span>

              <button className="rounded-full ring-offset-2 transition hover:ring-2 hover:ring-border">
                <Avatar>
                  <AvatarImage src={user?.photoUrl} alt={user?.firstName} />
                  <AvatarFallback>{user?.firstName}</AvatarFallback>
                </Avatar>
              </button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm">
                Log in
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-orange-400 to-amber-300 text-white"
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
