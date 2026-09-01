import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProfileCard } from "@/components/ProfileCard";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "@/utils/userSlice";
import {toast} from "sonner"
import { motion } from "framer-motion";

export function EditProfileForm({ user }) {
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [about, setAbout] = useState(user.about);
  // Stored as the raw text you type, not as an array. Round-tripping through
  // an array on every keystroke stripped the comma the moment you typed it:
  // "React," split to ["React", ""], the empty entry got filtered out, and the
  // input re-rendered as "React" — so a comma could never be typed.
  const [skillsText, setSkillsText] = useState((user.skills || []).join(", "));
  const dispatch = useDispatch();

  // Array form, derived on each render — used for the save payload and the
  // preview card
  const skills = skillsText
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);

  const saveProfile = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, photoUrl, about, skills },
        { withCredentials: true },
      );
      dispatch(addUser(res?.data?.data));
      toast.success("Update successful", {
        description: "Your profile has been updated"
      })
    }
  
  catch (err) {
    toast.error("Something went wrong", { description: err?.response?.data || "Please try again." })
  }
}


  return  user && (
    // max-w-4xl rather than 6xl — at the wider size the form column ran to
    // ~700px, so a five-character name sat in an input wide enough for a
    // paragraph. Fixed preview width keeps the form near ~540px.
    <div className="mx-auto max-w-4xl px-6 py-6">
      {/* Compact header — inline with less vertical weight so it doesn't
          eat into the space the form and preview need */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-5 flex items-baseline gap-3"
      >
        <h1 className="text-2xl font-extrabold tracking-tight">Your profile</h1>
        <p className="hidden text-sm text-muted-foreground sm:block">
          Changes appear in the preview as you type.
        </p>
      </motion.div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* LEFT: the form */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="rounded-2xl border border-white/10 bg-card p-6 shadow-2xl shadow-black/40"
        >
          <form>
            {/* First name + last name side by side */}
            <div className="mb-3 grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="focus-visible:ring-2 focus-visible:ring-amber-400/50"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="focus-visible:ring-2 focus-visible:ring-amber-400/50"
                />
              </div>
            </div>

            {/* Age + gender side by side */}
            <div className="mb-3 grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="focus-visible:ring-2 focus-visible:ring-amber-400/50"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="focus-visible:ring-2 focus-visible:ring-amber-400/50"
                />
              </div>
            </div>

            {/* Photo URL */}
            <div className="mb-3 space-y-1">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input
                id="photoUrl"
                name="photoUrl"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="focus-visible:ring-2 focus-visible:ring-amber-400/50"
              />
            </div>

            {/* Skills — typed as plain comma-separated text; the array form
                is derived from it above */}
            <div className="mb-3 space-y-1">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                name="skills"
                value={skillsText}
                placeholder="React, Node.js, MongoDB"
                onChange={(e) => setSkillsText(e.target.value)}
                className="focus-visible:ring-2 focus-visible:ring-amber-400/50"
              />
            </div>

            {/* About */}
            <div className="mb-4 space-y-1">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                name="about"
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="resize-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
              />
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="button"
                className="w-full bg-gradient-to-r from-orange-400 to-amber-300 text-white shadow-lg shadow-orange-500/20"
                onClick = {saveProfile}
              >
                Save changes
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* RIGHT: live preview. Uses ProfileCard's `preview` variant — a
            static, non-interactive version at real (smaller) font sizes,
            rather than a CSS-scaled copy of the full card. */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <ProfileCard
            preview
            user={{ firstName, lastName, age, gender, photoUrl, about, skills }}
          />
        </motion.div>
      </div>
    </div>
  );
}