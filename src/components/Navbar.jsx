import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Code2,
  Flame,
  Users,
  UserPlus,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { BASE_URL } from "@/utils/constants";
import { removeUser } from "@/utils/userSlice";
import { addRequests } from "@/utils/requestSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect } from "react";

const NAV_LINKS = [
  { to: "/", label: "Feed", icon: Flame },
  { to: "/connections", label: "Connections", icon: Users },
  { to: "/requests", label: "Requests", icon: UserPlus, showBadge: true },
];

export function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((store) => store.user);
  const loggedIn = !!user;

  // Slice starts as null, so guard before reading .length
  const requests = useSelector((store) => store.request);
  const requestCount = requests ? requests.length : 0;

  // The logo links to "/" the same as the Feed tab, so it gets a subtle
  // active treatment when you're already there
  const onFeed = location.pathname === "/";

  // The request slice is normally only filled when you visit /requests, but the
  // badge needs a count on every page — so fetch it once here on login.
  useEffect(() => {
    if (!loggedIn) return;

    const getRequests = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/requests/received", {
          withCredentials: true,
        });
        dispatch(addRequests(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    getRequests();
  }, [loggedIn, dispatch]);

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
      {/* Logo — glows and goes full-strength when you're on the feed, dims
          slightly elsewhere, since it points to the same route as the Feed tab */}
      <Link
        to="/"
        className={`flex shrink-0 items-center gap-2 transition-opacity ${
          onFeed ? "text-foreground" : "text-foreground/80 hover:text-foreground"
        }`}
      >
        <motion.div
          whileHover={{ scale: 1.08, rotate: -4 }}
          whileTap={{ scale: 0.95 }}
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-300 transition-shadow ${
            onFeed ? "shadow-lg shadow-orange-500/30" : ""
          }`}
        >
          <Code2 className="h-4 w-4 text-white" />
        </motion.div>
        <span className="hidden text-lg font-bold tracking-tight sm:inline">
          DevConnect
        </span>
      </Link>

      {/* Center nav — icon pills with an active state, replaces the buried
          dropdown-only navigation with something visible at all times.
          Profile deliberately lives under the avatar on the right, not here,
          to avoid two things in the same bar pointing at the same route. */}
      <nav className="ml-2 hidden items-center gap-1 rounded-full bg-muted/60 p-1 md:flex">
        {NAV_LINKS.map(({ to, label, icon: Icon, showBadge }) => {
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

                {/* Pending-request count. Offset far enough to clear the pill's
                    rounded corner, with a background-colored ring so it doesn't
                    leave a dark halo on top of the orange active pill. */}
                {showBadge && requestCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 z-20 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-background">
                    {requestCount > 9 ? "9+" : requestCount}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {loggedIn ? (
          <DropdownMenu>
            {/* Wrapped in a bordered pill so it reads as a control rather than
                a lone circle floating against the right edge */}
            <DropdownMenuTrigger className="relative flex items-center gap-2 rounded-full border border-white/10 bg-muted/40 py-1 pl-1 pr-2 transition hover:border-white/20 hover:bg-muted/70 lg:pr-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoUrl} alt={user?.firstName} />
                {/* Just the initial — the full name overflows the circle */}
                <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium lg:inline">
                {user?.firstName}
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:inline" />
              {/* Small dot so the count is still visible on mobile, where the
                  center nav is hidden */}
              {requestCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-background md:hidden" />
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 rounded-2xl border-white/5 p-2 shadow-2xl shadow-black/40"
            >
              {/* Account header — now an actual link, since it says
                  "View profile" and previously did nothing when clicked */}
              <Link to="/profile">
                <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3 transition hover:bg-muted">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.photoUrl} alt={user?.firstName} />
                    <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      View profile
                    </p>
                  </div>
                </div>
              </Link>

              <DropdownMenuSeparator className="my-2" />

              <Link to="/profile">
                <DropdownMenuItem className="gap-2.5 rounded-lg py-2">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
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
                  {requestCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                      {requestCount}
                    </span>
                  )}
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