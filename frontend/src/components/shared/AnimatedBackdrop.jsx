import { motion } from "framer-motion";

const blobs = [
  {
    className: "left-[-12%] top-[-8%] h-72 w-72 bg-cyan-400/18",
    animate: { x: [0, 30, -20, 0], y: [0, 40, 10, 0], scale: [1, 1.08, 0.96, 1] },
    duration: 16,
  },
  {
    className: "right-[8%] top-[12%] h-56 w-56 bg-brand-400/18",
    animate: { x: [0, -26, 18, 0], y: [0, 22, -24, 0], scale: [1, 0.94, 1.06, 1] },
    duration: 14,
  },
  {
    className: "bottom-[-10%] left-[26%] h-80 w-80 bg-sky-400/12",
    animate: { x: [0, 18, -24, 0], y: [0, -18, 26, 0], scale: [1, 1.04, 0.92, 1] },
    duration: 18,
  },
];

export default function AnimatedBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
      {blobs.map((blob) => (
        <motion.div
          key={blob.className}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          animate={blob.animate}
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.08),rgba(15,23,42,0.32))]" />
    </div>
  );
}
