import { Badge } from "@/components/ui/badge";
import { addConnections } from "@/utils/connectionsSlice";
import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { User as UserIcon } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export function Connections() {
  const dispatch = useDispatch();

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data));
      console.log(res?.data);
    } catch (err) {
      console.log(err);
      toast.error("Coudn't load connections");
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  const connections = useSelector((store) => store.connection);
  console.log(connections);

  if (connections && connections.length === 0) {
    return (
        <div className="mx-auto max-w-xl p-6 text-center">
          <h2 className="mb-2 text-2xl font-bold">Your Connections</h2>
          <p className="text-muted-foreground">
            You don't have any connections yet.
          </p>
        </div>
    );
  }

  return connections && (
    <div className="mx-auto max-w-xl p-6">
      <h2 className="mb-6 text-2xl font-bold">Your Connections</h2>

      <div className="space-y-4">
        {connections.map((connection) => {
          const { firstName, lastName, age, gender, photoUrl, about, skills } =
            connection;

          return (
            <div
              key={connection._id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              {/* Photo — same fallback pattern as ProfileCard */}
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={firstName}
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted">
                  <UserIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}

              {/* Name, age/gender, about, skills */}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold">
                  {firstName} {lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {age} · {gender}
                </p>
                <p className="mt-1 truncate text-sm">{about}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
