import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Code2,
  Flame,
  Users,
  UserPlus,
  Settings,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { BASE_URL } from "@/utils/constants";
import { removeUser } from "@/utils/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/", label: "Feed", icon: Flame },
  { to: "/connections", label: "Connections", icon: Users },
  { to: "/requests", label: "Requests", icon: UserPlus },
];

export function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((store) => store.user);
  const loggedIn = !!user;

  // Just toggles whether the search input is expanded — purely visual state.
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 flex h-16 w-full items-center gap-3 border-b border-white/5 bg-card/80 px-6 shadow-lg shadow-black/20 backdrop-blur-xl lg:px-8"
    >
      {/* Logo */}
      <Link to="/" className="flex shrink-0 items-center gap-2 text-foreground">
        <motion.div
          whileHover={{ scale: 1.08, rotate: -4 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-300"
        >
          <Code2 className="h-4 w-4 text-white" />
        </motion.div>
        <span className="hidden text-lg font-bold tracking-tight sm:inline">
          DevConnect
        </span>
      </Link>

      {/* Center nav — icon pills with an active state, replaces the buried
          dropdown-only navigation with something visible at all times */}
      <nav className="ml-2 hidden items-center gap-1 rounded-full bg-muted/60 p-1 md:flex">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link key={to} to={to}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-300"
                  />
                )}
                <Icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Search — collapses to just an icon, expands on click */}
      <div className="ml-auto flex items-center gap-2">
        <motion.div
          animate={{ width: searchOpen ? 220 : 36 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative hidden h-9 overflow-hidden sm:block"
        >
          {searchOpen ? (
            <>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                type="search"
                placeholder="Search..."
                onBlur={() => setSearchOpen(false)}
                className="h-9 rounded-full border-0 bg-muted pl-9 focus-visible:ring-2 focus-visible:ring-amber-400/50"
              />
            </>
          ) : (
            <motion.button
              type="button"
              onClick={() => setSearchOpen(true)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </motion.button>
          )}
        </motion.div>

        {loggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full ring-offset-2 ring-offset-background transition hover:ring-2 hover:ring-amber-400/60">
              <Avatar>
                <AvatarImage src={user?.photoUrl} alt={user?.firstName} />
                <AvatarFallback>{user?.firstName}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 rounded-2xl border-white/5 p-2 shadow-2xl shadow-black/40"
            >
              {/* Account header — name, photo, and greeting, like a real
                  account menu instead of a plain list of links */}
              <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.photoUrl} alt={user?.firstName} />
                  <AvatarFallback>{user?.firstName}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">View profile</p>
                </div>
              </div>

              <DropdownMenuSeparator className="my-2" />

              <Link to="/connections">
                <DropdownMenuItem className="gap-2.5 rounded-lg py-2">
                  <Users className="h-4 w-4" />
                  Connections
                </DropdownMenuItem>
              </Link>
              <Link to="/requests">
                <DropdownMenuItem className="gap-2.5 rounded-lg py-2">
                  <UserPlus className="h-4 w-4" />
                  Requests
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="gap-2.5 rounded-lg py-2">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2" />

              <DropdownMenuItem
                variant="destructive"
                onClick={handleLogout}
                className="gap-2.5 rounded-lg py-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button
                size="sm"
                className="rounded-full bg-gradient-to-r from-orange-400 to-amber-300 text-white"
              >
                Sign up
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </motion.header>
  );
}