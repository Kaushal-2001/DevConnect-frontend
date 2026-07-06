import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Code2 } from "lucide-react";

export function Signup() {
  // This just remembers whether the password should be visible or hidden.
  // false = hidden (default), true = visible
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">

      {/* Card */}
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">

        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <Code2 className="h-5 w-5" />
          <span className="text-lg font-bold">DevConnect</span>
        </div>

        {/* Heading */}
        <h2 className="mb-2 text-center text-2xl font-bold">
          Create your account
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Already have one?{" "}
          <Link to="/login" className="font-medium underline">
            Log in
          </Link>
        </p>

        {/* The actual form */}
        <form>

          {/* First name + last name side by side */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" placeholder="Ada" required />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" placeholder="Lovelace" required />
            </div>
          </div>

          {/* Email field */}
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ada@devconnect.com"
              required
            />
          </div>

          {/* Password field */}
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>

            {/* relative wrapper so we can place the eye icon inside the input */}
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-amber-300 text-white"
          >
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing up, you agree to DevConnect's Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}