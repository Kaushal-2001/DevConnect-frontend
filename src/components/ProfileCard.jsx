import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";

// `profile` is expected to look like the object your backend sends back:
// { firstName, lastName, skills, about, age, gender, photoUrl }
export function ProfileCard({ user }) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card">
      {/* Photo */}
      <img
        src={user.photoUrl}
        alt={user.firstName}
        className="h-64 w-full object-cover"
      />

      {/* Info section */}
      <div className="p-5">
        {/* Name, age, gender */}
        <h3 className="text-xl font-bold">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-sm text-muted-foreground">
          {user.age} · {user.gender}
        </p>

        {/* About */}
        <p className="mt-3 text-sm">{user.about}</p>

        {/* Skills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 border-t border-border p-4">
        <Button variant="outline" className="flex-1 gap-2">
          <X className="h-4 w-4" />
          Pass
        </Button>
        <Button className="flex-1 gap-2 bg-gradient-to-r from-orange-400 to-amber-300 text-white">
          <Check className="h-4 w-4" />
          Connect
        </Button>
      </div>
    </div>
  );
}
