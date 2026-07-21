import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Code2 } from "lucide-react";
import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "@/utils/userSlice";
import { toast } from "sonner";

export function Signup() {
  // This just remembers whether the password should be visible or hidden.
  // false = hidden (default), true = visible
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, email, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      navigate("/profile");
      toast.success("Successfully signed up");
      console.log(res.data);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

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
              <Input
                id="firstName"
                name="firstName"
                value={firstName}
                placeholder="First Name"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={lastName}
                placeholder="Last Name"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                required
              />
            </div>
          </div>

          {/* Email field */}
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              placeholder="ada@devconnect.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
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
                value={password}
                placeholder="At least 8 characters"
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
            onClick={() => {
              handleSignup();
            }}
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
