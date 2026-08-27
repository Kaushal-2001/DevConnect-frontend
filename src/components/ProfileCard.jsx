import { Badge } from "@/components/ui/badge";
import { X, Check, User as UserIcon } from "lucide-react";
import axios from "axios";
import { removeFromFeed } from "@/utils/feedSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "@/utils/constants";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export function ProfileCard({ user }) {
  const dispatch = useDispatch();
  const controls = useAnimation();
  const [exitX, setExitX] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-70, 0, 70], [-8, 0, 8]);
  const likeOpacity = useTransform(x, [10, 55], [0, 1]);
  const nopeOpacity = useTransform(x, [-55, -10], [1, 0]);

  const handleSendRequest = async (status, _id) => {
    await axios.post(
      BASE_URL + "/request/sendconnectionrequest/" + status + "/" + _id,
      {},
      { withCredentials: true },
    );
  };

  const swipe = async (direction) => {
    const status = direction === "right" ? "interested" : "ignore";
    setExitX(direction === "right" ? 300 : -300);

    try {
      await handleSendRequest(status, user._id);
      dispatch(removeFromFeed(user._id));
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
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
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
    }
  };

  return (
    // The entrance animation lives on this wrapper, not on the card itself.
    // The card's `animate` prop is bound to the useAnimation controls (used
    // for drag snap-back), so it can't also run a mount animation.
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        className="col-start-1 row-start-1 w-full cursor-grab overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl shadow-black/40 active:cursor-grabbing"
        style={{ x, rotate }}
        animate={controls}
        exit={{
          x: exitX,
          opacity: 0,
          rotate: exitX > 0 ? 12 : -12,
          transition: { duration: 0.2 },
        }}
        drag="x"
        dragConstraints={{ left: -70, right: 70 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 1.02 }}
      >
        {/* Stamps reworded to match the professional reskin — no dating language */}
        <motion.div
          className="absolute left-4 top-4 z-10 rounded-lg border-4 border-emerald-400 px-3 py-1 text-xl font-black tracking-wide text-emerald-400"
          style={{ opacity: likeOpacity, rotate: -15 }}
        >
          CONNECT
        </motion.div>
        <motion.div
          className="absolute right-4 top-4 z-10 rounded-lg border-4 border-rose-500 px-3 py-1 text-xl font-black tracking-wide text-rose-500"
          style={{ opacity: nopeOpacity, rotate: 15 }}
        >
          PASS
        </motion.div>

        {/* Photo dominates the card. Height caps at 520px on tall screens but
            shrinks on short ones, so the card plus navbar and buttons always
            fit on screen without scrolling. */}
        <div className="relative h-[min(620px,calc(100vh-220px))] w-full">
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user?.firstName}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <UserIcon className="h-20 w-20 text-muted-foreground" />
            </div>
          )}

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(20,10,5,0.95) 0%, rgba(20,10,5,0.4) 35%, rgba(20,10,5,0) 65%)",
            }}
          />

          {/* pb-20 leaves a clear strip at the bottom for the floating action
              buttons — without it the skill badges render underneath them */}
          <div className="absolute inset-x-0 bottom-0 p-5 pb-20 text-white">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold tracking-tight">
                {user?.firstName} {user?.lastName}
              </h3>
              <span className="text-2xl font-light text-white/80">
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

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/90">
              {user?.about}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {user?.skills?.slice(0, 4).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="rounded-full border-0 bg-white/15 px-3 py-1 font-medium text-white backdrop-blur-sm"
                >
                  {skill}
                </Badge>
              ))}
              {user?.skills?.length > 4 && (
                <Badge
                  variant="outline"
                  className="rounded-full border-white/30 px-3 py-1 text-white"
                >
                  +{user.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating circular action buttons, overlapping the bottom edge of the card */}
      <div className="absolute inset-x-0 -bottom-9 z-20 flex justify-center gap-8">
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
            {/* Solid red fill that fades in as you drag left — sits behind the icon */}
            <motion.div
              className="absolute inset-0 rounded-full bg-rose-500"
              style={{ opacity: nopeOpacity }}
            />
            <X className="relative z-10 h-6 w-6" />
          </motion.button>
          <span className="text-xs font-medium text-muted-foreground">
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
            {/* Solid green fill that fades in as you drag right — sits behind the icon */}
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-500"
              style={{ opacity: likeOpacity }}
            />
            <Check className="relative z-10 h-6 w-6" />
          </motion.button>
          <span className="text-xs font-medium text-muted-foreground">
            Connect
          </span>
        </div>
      </div>
    </motion.div>
  );
}