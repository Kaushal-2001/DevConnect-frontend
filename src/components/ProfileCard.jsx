import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Check, User as UserIcon } from "lucide-react";
import axios from "axios";
import { removeFromFeed } from "@/utils/feedSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "@/utils/constants";

export function ProfileCard({ user }) {
  const dispatch = useDispatch();
  const handleSendRequest = async (status, _id) => {
    const res = await axios.post(
      BASE_URL + "/request/sendconnectionrequest/" + status + "/" + _id,
      {},
      { withCredentials: true },
    );
    dispatch(removeFromFeed(_id));
  };

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Photo with name/age/gender overlaid at the bottom */}
      <div className="relative h-64 w-full">
        {user?.photoUrl ? (
          <img
            src={user.photoUrl}
            alt={user?.firstName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <UserIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        )}

        {/* Gradient scrim so white text stays readable over any photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 70%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="text-xl font-bold">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-sm text-white/80">
            {user?.age} · {user?.gender}
          </p>
        </div>
      </div>

      {/* Info section — about + skills, same as before */}
      <div className="p-5">
        <p className="line-clamp-3 text-sm">{user?.about}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {user?.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
          {user?.skills.length > 4 && (
            <Badge variant="outline">+{user.skills.length - 4} more</Badge>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 border-t border-border p-4">
        <Button
          onClick={() => handleSendRequest("ignore", user._id)}
          variant="outline"
          className="flex-1 gap-2"
        >
          <X className="h-4 w-4" />
          Pass
        </Button>
        <Button
          onClick={() => handleSendRequest("interested", user._id)}
          className="flex-1 gap-2 bg-gradient-to-r from-orange-400 to-amber-300 text-white"
        >
          <Check className="h-4 w-4" />
          Connect
        </Button>
      </div>
    </div>
  );
}
