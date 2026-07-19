import { ProfileCard } from "@/components/ProfileCard";
import { BASE_URL } from "@/utils/constants";
import { addFeed } from "@/utils/feedSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users } from "lucide-react";

export function Feed() {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (feed?.length <= 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-xl font-bold">No more people found</h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          You've seen everyone in your area for now. Check back later for new
          profiles.
        </p>
      </div>
    );
  }

  return (
    feed && (
      <div className="flex justify-center p-6">
        <ProfileCard user={feed[0]} />
      </div>
    )
  );
}
