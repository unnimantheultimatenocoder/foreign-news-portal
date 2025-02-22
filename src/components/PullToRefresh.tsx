import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  disabled = false,
  children,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const y = useMotionValue(0);
  const controls = useAnimation();
  const pullProgress = useTransform(y, [0, 100], [0, 1]);
  const refreshIndicatorRotation = useTransform(pullProgress, [0, 1], [0, 360]);

  useEffect(() => {
    if (!isRefreshing) {
      controls.start({ y: 0 });
    }
  }, [isRefreshing, controls]);

  const handleDragEnd = async () => {
    if (disabled || isRefreshing) return;

    const currentY = y.get();
    if (currentY >= 100) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    controls.start({ y: 0 });
  };

  return (
    <motion.div
      style={{ position: 'relative', touchAction: 'pan-x' }}
      drag={!disabled ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 100 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={controls}
    >
      <motion.div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: -30,
          opacity: pullProgress,
        }}
      >
        <motion.div
          style={{
            width: '24px',
            height: '24px',
            border: '2px solid #666',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            rotate: refreshIndicatorRotation,
          }}
          animate={isRefreshing ? { rotate: 360 } : undefined}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : undefined}
        />
      </motion.div>
      {children}
    </motion.div>
  );
};