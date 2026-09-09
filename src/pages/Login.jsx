import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Code2 } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "@/utils/userSlice";
import { BASE_URL } from "@/utils/constants";
import { motion } from "framer-motion";

export function Login() {
  // This just remembers whether the password should be visible or hidden.
  // false = hidden (default), true = visible
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("rosa.delgado@example.com");
  const [password, setPassword] = useState("Rosa@123");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      console.log(res.data);
      dispatch(addUser(res.data))
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      {/* The Login Card — now with real depth and a fade/scale-in
          entrance, matching Signup/ProfileCard/Navbar */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-card p-8 shadow-2xl shadow-black/40"
      >
        {/* Logo — icon in a gradient badge, matching the Navbar */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-300">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold">DevConnect</span>
        </div>

        {/* Heading — stronger size/weight contrast, matching Signup */}
        <h2 className="mb-2 text-center text-3xl font-extrabold tracking-tight">
          Log in to your account
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Don't have one?{" "}
          <Link to="/signup" className="font-medium text-amber-400 underline">
            Sign up
          </Link>
        </p>

        {/* The actual form */}
        <form>
          {/* Email field */}
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              placeholder="kaus@gamil.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="focus-visible:ring-2 focus-visible:ring-amber-400/50"
              required
            />
          </div>

          {/* Password field */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <span className="text-xs text-amber-400 underline">
                Forgot password?
              </span>
            </div>

            {/* relative wrapper so we can place the eye icon inside the input */}
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="pr-10 focus-visible:ring-2 focus-visible:ring-amber-400/50"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-amber-400"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit button — slightly taller, with a hover/tap pop */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              className="w-full bg-gradient-to-r from-orange-400 to-amber-300 py-6 text-white"
              onClick={handleLogin}
            >
              Log in
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}