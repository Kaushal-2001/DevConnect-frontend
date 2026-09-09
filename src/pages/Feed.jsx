import { ProfileCard } from "@/components/ProfileCard";
import { BASE_URL, CARD_HEIGHT } from "@/utils/constants";
import { addFeed } from "@/utils/feedSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, User as UserIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Where each preview sits relative to the top card. Index 0 is directly
// behind it, index 1 behind that. Kept in one place so the top card's
// entrance can start from the same numbers the deck ends on.
const DECK_LAYERS = [
  { scale: 0.95, y: -12, scrim: 0.6 },
  { scale: 0.9, y: -24, scrim: 0.75 },
];

// A dimmed, blurred prevfsdiew of an upcoming profile. Decorative only.
function DeckCard({ user, depth }) {
  const layer = DECK_LAYERS[depth];

  return (
    <motion.div
      // self-start stops the shell stretching to the full grid row height,
      // which was making the previews hang below the card
      className="relative col-start-1 row-start-1 origin-top self-start overflow-hidden rounded-2xl border border-white/10 bg-card"
      style={{ zIndex: 10 - depth }}
      // Enters from further back, then animates forward each time the deck
      // shifts up — that's what makes the promotion read as one motion
      // instead of the content silently swapping
      initial={{ scale: 0.86, y: -34, opacity: 0 }}
      animate={{ scale: layer.scale, y: layer.y, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      {/* Same height as the real card's photo, so the stack lines up */}
      <div className={CARD_HEIGHT + " w-full"}>
        {user?.photoUrl ? (
          // scale-105 hides the soft transparent edge blur leaves behind
          <img
            src={user.photoUrl}
            alt=""
            className="h-full w-full scale-105 object-cover blur-[3px]"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/40">
            <UserIcon className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* Scrim lifts as the card moves forward. Heavy at the back because a
          portrait on a white background reads as a bright slab otherwise. */}
      <motion.div
        className="absolute inset-0 bg-background"
        animate={{ opacity: layer.scrim }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
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
      // overflow-x-clip stops the thrown card from adding a horizontal
      // scrollbar. "clip" rather than "hidden" so vertical stays untouched.
      <div className="relative flex justify-center overflow-x-clip px-6 pb-28 pt-4">
        {/* Dot grid — gives the empty space texture instead of flat black.
            The mask fades it out toward the edges and behind the card, so it
            never competes with the content sitting on top of it. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 20%, black 70%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 20%, black 70%, transparent 100%)",
            opacity: 0.2,
          }}
        />

        {/* Wide ambient glow. Much larger and fainter than before — at 420px
            it sat entirely behind the card on desktop, so none of it was
            actually visible. */}
        <div className="pointer-events-none absolute left-1/2 top-24 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-orange-500/[0.07] blur-[180px]" />

        {/* Second, offset glow in a cooler tone. Two light sources read as
            depth; one centered blob reads as a smudge. */}
        <div className="pointer-events-none absolute left-[15%] top-1/3 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.05] blur-[150px]" />

        <div className="relative w-full max-w-sm">
          {/* Position counter — tells the user how far through the deck they are */}
          <div className="mb-3 flex justify-center">
            <span className="rounded-full border border-white/10 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              {currentPosition} of {totalCount}
            </span>
          </div>

          {/* Every layer lives in the same grid cell (col-start-1 row-start-1)
              so they stack instead of flowing one below the other. mt-8 leaves
              room for the previews to peek above the top card. */}
          <div className="mt-8 grid w-full">
            {/* Mapped rather than written out one by one, so each preview keeps
                its key when the deck shifts. Same key means React reuses the
                element and Framer animates it forward, instead of the content
                silently swapping in place. */}
            {feed.slice(1, 3).map((profile, index) => (
              <DeckCard key={profile._id} user={profile} depth={index} />
            ))}

            {/* No wrapper div here on purpose — AnimatePresence renders no DOM
                of its own, so the cards become direct grid children and the
                exiting and entering card share one cell. */}
            <AnimatePresence>
              {feed[0] && <ProfileCard key={feed[0]._id} user={feed[0]} />}
            </AnimatePresence>
          </div>
        </div>

        {/* Drag hint — sits below the card, fills some of the empty space with
            something useful rather than more decoration */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-xs text-muted-foreground/60">
            Drag the card or use the buttons
          </p>
        </div>
      </div>
    )
  );
}