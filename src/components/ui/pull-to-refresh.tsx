import { motion, useAnimation, PanInfo } from "framer-motion";
import { useEffect, useState } from "react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  disabled = false,
}) => {
  const controls = useAnimation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);

  const PULL_THRESHOLD = 100; // Distance in pixels needed to trigger refresh

  useEffect(() => {
    if (!isRefreshing) {
      controls.start({ y: 0 });
    }
  }, [isRefreshing, controls]);

  const handleDrag = (_: any, info: PanInfo) => {
    if (disabled || isRefreshing) return;

    const pullDistance = Math.max(0, info.offset.y);
    const progress = Math.min(1, pullDistance / PULL_THRESHOLD);
    setPullProgress(progress);

    controls.set({ y: pullDistance * 0.4 }); // Add resistance to pull
  };

  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (disabled || isRefreshing) return;

    const pullDistance = Math.max(0, info.offset.y);
    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullProgress(0);
      }
    }

    controls.start({
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Refresh indicator */}
      <div
        className="absolute left-0 right-0 flex justify-center"
        style={{
          top: -50,
          opacity: Math.min(1, pullProgress * 2),
          transform: `scale(${Math.min(1, pullProgress * 1.5)})`,
        }}
      >
        <div
          className={`h-8 w-8 rounded-full border-2 border-accent ${isRefreshing ? 'animate-spin' : ''}`}
          style={{
            borderRightColor: 'transparent',
            transform: `rotate(${pullProgress * 360}deg)`,
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        drag="y"
        dragDirectionLock
        dragElastic={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        {children}
      </motion.div>
    </div>
  );
};