import { ProfileCard } from "@/components/ProfileCard";
import { BASE_URL } from "@/utils/constants";
import { addFeed } from "@/utils/feedSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, User as UserIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";

// A dimmed, blurred preview of an upcoming profile sitting behind the top card
// so the feed reads as a deck of people. Decorative only — no drag, no click.
function DeckCard({ user, className, scrimClass }) {
  return (
    <div
      className={
        "relative col-start-1 row-start-1 overflow-hidden rounded-2xl border border-white/10 bg-card " +
        className
      }
    >
      {user?.photoUrl ? (
        // scale-105 hides the soft transparent edge that blur leaves behind
        <img
          src={user.photoUrl}
          alt=""
          className="h-full w-full scale-105 object-cover blur-[3px]"
          draggable={false}
        />
      ) : (
        // Dimmer than the real card's empty state, so a photo-less profile
        // still reads as sitting further back in the stack
        <div className="flex h-full w-full items-center justify-center bg-muted/40">
          <UserIcon className="h-12 w-12 text-muted-foreground/50" />
        </div>
      )}
      {/* Light scrim only — enough to push it back visually, not so much that
          it turns into a flat grey slab when the top card swipes away */}
      <div className={"absolute inset-0 " + scrimClass} />
    </div>
  );
}

export function Feed() {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  // Remembers how many profiles the fetch returned. Needed because feed.length
  // shrinks on every swipe, so it can't tell us the original total on its own.
  const [totalProfiles, setTotalProfiles] = useState(0);

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
      setTotalProfiles(res.data.length);
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

  // Math.max covers the brief moment after a remount where totalProfiles is
  // still 0 but Redux already has a feed — without it the counter goes negative.
  const feedLength = feed ? feed.length : 0;
  const totalCount = Math.max(totalProfiles, feedLength);
  const currentPosition = totalCount - feedLength + 1;

  return (
    feed && (
      <div className="relative flex justify-center px-6 pb-20 pt-4">
        {/* Soft accent glow behind the card. Purely decorative — gives the
            page some depth instead of a card floating on flat black. */}
        <div className="pointer-events-none absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[130px]" />

        <div className="relative w-full max-w-sm">
          {/* Position counter — tells the user how far through the deck they are */}
          <div className="mb-3 flex justify-center">
            <span className="rounded-full border border-white/10 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              {currentPosition} of {totalCount}
            </span>
          </div>

          {/* mt-8 leaves room for the stacked previews to peek above the card */}
          <div className="mt-8 grid w-full">
            {/* origin-top keeps each shell's top edge fixed while scaling, so
                the -translate-y values control exactly how far each one peeks */}
            {feed[2] && (
              <DeckCard
                user={feed[2]}
                className="origin-top -translate-y-6 scale-[0.90]"
                scrimClass="bg-background/55"
              />
            )}
            {feed[1] && (
              <DeckCard
                user={feed[1]}
                className="origin-top -translate-y-3 scale-[0.95]"
                scrimClass="bg-background/30"
              />
            )}

            <div className="col-start-1 row-start-1 z-10">
              <AnimatePresence>
                {feed[0] && <ProfileCard key={feed[0]._id} user={feed[0]} />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    )
  );
}