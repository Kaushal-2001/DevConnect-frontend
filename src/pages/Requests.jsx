import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/utils/constants";
import { addRequests, removeRequest } from "@/utils/requestSlice";
import axios from "axios";
import { X, Check, User as UserIcon } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export function Requests() {
  const dispatch = useDispatch();
  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data));
      console.log(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  const request = useSelector((store) => store.request);

  if (request && request.length === 0) {
    return (
      <div className="mx-auto max-w-xl p-6 text-center">
        <h2 className="mb-2 text-2xl font-bold">Connection Requests</h2>
        <p className="text-muted-foreground">No pending requests right now.</p>
      </div>
    );
  }

  const reviewRequest = async (status, _id, firstName) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      console.log(res)
      dispatch(removeRequest(_id))
      toast.success(`Request from ${firstName} ${status}`)
    } catch (err) {
      toast.error(err.response.data.message)
    }

  };

  return (
    request && (
      <div className="mx-auto max-w-2xl p-6">
        <h2 className="mb-6 text-2xl font-bold">Connection Requests</h2>

        <div className="space-y-4">
          {request.map((request) => {
            const { firstName, lastName, age, gender, photoUrl, skills } =
              request.fromUserId;
            
            return (
              <div
                key={request._id}
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

                {/* Name, age/gender, skills */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {age} · {gender}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  <Button onClick={() => reviewRequest("rejected", request._id, request?.fromUserId?.firstName)} variant="outline" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => reviewRequest("accepted", request._id, request?.fromUserId?.firstName)}  className="bg-gradient-to-r from-orange-400 to-amber-300 text-white">
                    <Check className="h-4 w-4" />
                    Accept
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
}
