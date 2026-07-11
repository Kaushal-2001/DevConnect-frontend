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

export function Login() {
  // This just remembers whether the password should be visible or hidden.
  // false = hidden (default), true = visible
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("kaus@gmail.com");
  const [password, setPassword] = useState("Kaus@123");

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
      {/* The Login Card */}
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <Code2 className="h-5 w-5" />
          <span className="text-lg font-bold">DevConnect</span>
        </div>

        {/* Heading */}
        <h2 className="mb-2 text-center text-2xl font-bold">
          Log in to your account
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Don't have one?{" "}
          <Link to="/signup" className="font-medium underline">
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
              required
            />
          </div>

          {/* Password field */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs underline">
                Forgot password?
              </Link>
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
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="button"
            className="w-full bg-gradient-to-r from-orange-400 to-amber-300 text-white"
            onClick={handleLogin}
          >
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
}
