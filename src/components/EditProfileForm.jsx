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

export function EditProfileForm({ user }) {
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills || []);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    const res = await axios.patch(
      BASE_URL + "/profile/edit",
      { firstName, lastName, age, gender, photoUrl, about, skills },
      { withCredentials: true },
    );
    dispatch(addUser(res?.data));
  };

  const handleSkillsChange = (e) => {
    const parsed = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
    setSkills(parsed);
  };

  return  user && (
    <div className="mx-auto max-w-5xl p-6">
      <div className="grid gap-10 md:grid-cols-2">
        {/* LEFT: the form */}
        <form>
          <h2 className="mb-6 text-2xl font-bold">Edit profile</h2>

          {/* First name + last name side by side */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Age + gender side by side */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>
          </div>

          {/* Photo URL */}
          <div className="mb-4 space-y-1.5">
            <Label htmlFor="photoUrl">Photo URL</Label>
            <Input
              id="photoUrl"
              name="photoUrl"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>

          {/* About */}
          <div className="mb-4 space-y-1.5">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              name="about"
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>

          {/* Skills — typed as comma-separated text, converted to an array
              by handleSkillsChange on every keystroke */}
          <div className="mb-4 space-y-1.5">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              name="skills"
              value={skills.join(", ")}
              onChange={handleSkillsChange}
            />
          </div>

          <Button
            type="submit"
            className="bg-gradient-to-r from-orange-400 to-amber-300 text-white"
            onClick = {saveProfile}
          >
            Save changes
          </Button>
        </form>

        {/* RIGHT: live preview, using the same ProfileCard shown in the feed */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">Preview</h2>
          <div className="flex justify-center">
            <ProfileCard
              user={{ firstName, lastName, age, gender, photoUrl, about, skills }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}