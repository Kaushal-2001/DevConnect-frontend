import { Badge } from "@/components/ui/badge";
import { X, Check, User as UserIcon } from "lucide-react";
import axios from "axios";
import { removeFromFeed, returnToFeed } from "@/utils/feedSlice";
import { useDispatch } from "react-redux";
import { BASE_URL, CARD_HEIGHT } from "@/utils/constants";
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

// `preview` renders a static, non-interactive version for the profile editor:
// no drag, no swipe, no action buttons, and a smaller photo. Without it the
// preview card would fire real connection requests with an undefined _id.
export function ProfileCard({ user, preview = false }) {
  const dispatch = useDispatch();
  const controls = useAnimation();
  const [exitX, setExitX] = useState(0);

  // Blocks a second swipe while the first is still animating out — without it
  // a fast double-click fires two requests for the same profile
  const [isLeaving, setIsLeaving] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-70, 0, 70], [-8, 0, 8]);

  // Stamps reach full strength early, so the feedback arrives while you're
  // still deciding rather than at the very end of the drag
  const likeOpacity = useTransform(x, [5, 40], [0, 1]);
  const nopeOpacity = useTransform(x, [-40, -5], [1, 0]);

  // Buttons fade as the card moves, so they aren't left stranded in the
  // middle of the screen over the next profile
  const controlsOpacity = useTransform(
    x,
    [-70, -20, 0, 20, 70],
    [0, 1, 1, 1, 0],
  );

  const handleSendRequest = async (status, _id) => {
    await axios.post(
      BASE_URL + "/request/sendconnectionrequest/" + status + "/" + _id,
      {},
      { withCredentials: true },
    );
  };

  // Fires after the card has been removed from the feed. If it fails, the
  // profile goes back — the swipe never actually registered on the server.
  const sendRequest = async (status) => {
    try {
      await handleSendRequest(status, user._id);
    } catch (err) {
      dispatch(returnToFeed(user));
      toast.error("Couldn't send that. The profile is back in your feed.");
    }
  };

  const swipe = (direction) => {
    if (isLeaving) return;
    setIsLeaving(true);

    const status = direction === "right" ? "interested" : "ignore";
    setExitX(direction === "right" ? 350 : -350);

    // Short nudge in the swipe direction first. A button press then drives the
    // same tilt, stamp and button fill that dragging does, instead of the card
    // just vanishing. Removing the card in onComplete lets that read first.
    animate(x, direction === "right" ? 80 : -80, {
      duration: 0.12,
      onComplete: () => {
        // Removed before the request finishes so the exit animation runs now,
        // not after the network round trip
        dispatch(removeFromFeed(user._id));
        sendRequest(status);
      },
    });
  };

  const handleDragEnd = (_, info) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      swipe("right");
    } else if (info.offset.x < -threshold) {
      swipe("left");
    } else {
      controls.start({
        x: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 400, damping: 28 },
      });
    }
  };

  // Size variants — real font sizes and padding rather than a CSS transform,
  // so the preview stays crisp instead of looking squashed
  const photoHeight = preview ? "aspect-[4/5]" : CARD_HEIGHT;
  const nameSize = preview ? "text-lg" : "text-2xl";
  const ageSize = preview ? "text-base" : "text-xl";
  // Full card leaves a strip at the bottom for the floating buttons. Kept
  // tight so the text block sits low on the photo — pushing it further up
  // ran the name into the subject's face.
  const overlayPadding = preview ? "p-4" : "p-5 pb-8";

  // The card's visible content, shared by both modes
  const cardBody = (
    <div className={"relative w-full " + photoHeight}>
      {user?.photoUrl ? (
        <img
          src={user.photoUrl}
          alt={user?.firstName}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <UserIcon className={preview ? "h-14 w-14 text-muted-foreground" : "h-20 w-20 text-muted-foreground"} />
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(20,10,5,0.97) 0%, rgba(20,10,5,0.88) 28%, rgba(20,10,5,0.5) 45%, rgba(20,10,5,0) 70%)",
        }}
      />

      <div className={"absolute inset-x-0 bottom-0 text-white " + overlayPadding}>
        {/* flex-wrap with the age and gender grouped together keeps them
            beside the name's last word instead of being pushed to the far
            edge when a long name wraps to two lines */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h3 className={"font-extrabold leading-tight tracking-tight " + nameSize}>
            {user?.firstName} {user?.lastName}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className={"font-light text-white/80 " + ageSize}>
              {user?.age}
            </span>
            {/* Gender demoted to a small neutral pill — as plain lowercase
                text it was competing with the name for attention */}
            {user?.gender && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium capitalize text-white/70 backdrop-blur-sm">
                {user.gender}
              </span>
            )}
          </div>
        </div>

        {/* Bio deliberately isn't shown on the card face. It made the text
            block tall enough to run into the subject's face, and no amount of
            padding or scrim tuning fixed that — the volume of content was the
            problem. Tinder does the same thing: the swipe card carries a name
            and a couple of short lines, with the bio behind a detail view.
            Skills are the more decision-relevant signal here anyway. */}

        <div className={"flex flex-wrap gap-1.5 " + (preview ? "mt-2" : "mt-3")}>
          {user?.skills?.slice(0, 4).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="rounded-full border-0 bg-white/15 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
            >
              {skill}
            </Badge>
          ))}
          {user?.skills?.length > 4 && (
            <Badge
              variant="outline"
              className="rounded-full border-white/30 px-2.5 py-0.5 text-xs text-white"
            >
              +{user.skills.length - 4} more
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  // Static, non-interactive version for the profile editor. Returns early so
  // none of the drag handlers, motion values or swipe logic are attached.
  if (preview) {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl shadow-black/40">
        {cardBody}
      </div>
    );
  }

  return (
    // This is the grid item, sharing a cell with the deck previews behind it.
    // Entrance starts at the front preview's exact position (scale 0.95,
    // y -12) so promotion looks like that card moving forward, not a new one
    // fading in on top.
    <motion.div
      className={`relative col-start-1 row-start-1 z-20 w-full origin-top self-start ${
        isLeaving ? "pointer-events-none" : ""
      }`}
      initial={{ scale: 0.95, y: -12 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <motion.div
        className="w-full cursor-grab overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl shadow-black/40 active:cursor-grabbing"
        style={{ x, rotate }}
        animate={controls}
        // Short slide-and-fade. Only x, opacity and rotate animate — dropping
        // the y drift and scale shrink keeps it smooth, and the fade covers
        // the handoff to the card coming forward behind it.
        exit={{
          x: exitX,
          opacity: 0,
          rotate: exitX > 0 ? 16 : -16,
          transition: { duration: 0.22, ease: "easeOut" },
        }}
        drag="x"
        dragConstraints={{ left: -70, right: 70 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 1.02 }}
      >
        {/* Stamp colours match their buttons — amber for connect (the brand
            accent), neutral for pass. Green/red would be two different colour
            identities from the buttons they correspond to, and red frames
            passing as a rejection rather than the neutral action it is. */}
        <motion.div
          className="absolute left-4 top-4 z-10 rounded-lg border-4 border-amber-400 px-3 py-1 text-xl font-black tracking-wide text-amber-400"
          style={{ opacity: likeOpacity, rotate: -15 }}
        >
          CONNECT
        </motion.div>
        <motion.div
          className="absolute right-4 top-4 z-10 rounded-lg border-4 border-white/60 px-3 py-1 text-xl font-black tracking-wide text-white/80"
          style={{ opacity: nopeOpacity, rotate: 15 }}
        >
          PASS
        </motion.div>

        {cardBody}
      </motion.div>

      {/* Action buttons sit fully below the card rather than overlapping it —
          at -bottom-9 they covered the skill badges and the subject's chin,
          and adding bottom padding to fix that pushed the text up into the
          face instead. They stay outside the draggable card so they fade as
          it moves rather than travelling off-screen with it. */}
      <motion.div
        style={{ opacity: controlsOpacity }}
        className="absolute inset-x-0 -bottom-16 z-20 flex justify-center gap-8"
      >
        {/* Each button sits in a column with a caption underneath, so a
            first-time user doesn't have to guess what the icons mean */}
        <div className="flex flex-col items-center gap-1.5">
          <motion.button
            type="button"
            onClick={() => swipe("left")}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-card text-foreground shadow-lg shadow-black/40"
          >
            {/* Neutral fill rather than red — passing on a profile is a
                normal choice here, not a rejection worth alarming about */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/25"
              style={{ opacity: nopeOpacity }}
            />
            <X className="relative z-10 h-6 w-6" />
          </motion.button>
          <span className="text-xs font-medium text-white/70">
            Pass
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <motion.button
            type="button"
            onClick={() => swipe("right")}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-amber-300 text-white shadow-lg shadow-orange-500/20"
          >
            {/* Deepens the existing amber rather than switching to green, so
                the button intensifies instead of becoming a different colour
                identity mid-drag */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-600 to-amber-500"
              style={{ opacity: likeOpacity }}
            />
            <Check className="relative z-10 h-6 w-6" />
          </motion.button>
          <span className="text-xs font-medium text-white/70">
            Connect
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}