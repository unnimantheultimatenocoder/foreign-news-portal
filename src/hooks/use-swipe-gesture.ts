import { useState } from "react";
import { useAnimation, PanInfo } from "framer-motion";

interface UseSwipeGestureProps {
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
  isMobile?: boolean;
}

export const useSwipeGesture = ({ onSwipe, isMobile = false }: UseSwipeGestureProps) => {
  const controls = useAnimation();
  const [isLoading, setIsLoading] = useState(false);

  const debouncedOnSwipe = async (direction: "left" | "right" | "up" | "down") => {
    // Add debounce logic here
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (onSwipe) {
        await onSwipe(direction);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 60; 
    const swipeVelocityThreshold = 150; 

    if (isMobile) {
      const direction = info.offset.y > 0 ? "down" : "up";
      const meetsSwipeCriteria =
        Math.abs(info.offset.y) > swipeThreshold ||
        Math.abs(info.velocity.y) > swipeVelocityThreshold;

      if (meetsSwipeCriteria) {
        const displacement = Math.min(
          Math.max(Math.abs(info.velocity.y) * 0.35, 120),
          250
        );

        await controls.start({
          y: info.offset.y > 0 ? displacement : -displacement,
          transition: {
            type: "spring",
            stiffness: 800, 
            damping: 10, 
            velocity: info.velocity.y,
          }
        });
        await debouncedOnSwipe(direction);
        controls.set({ y: 0 });
      } else {
        controls.start({
          y: 0,
          transition: {
            type: "spring",
            stiffness: 800, 
            damping: 10
          }
        });
      }
    } else {
      const direction = info.offset.x > 0 ? "right" : "left";

      if (Math.abs(info.offset.x) > swipeThreshold) {
        await controls.start({
          x: info.offset.x > 0 ? 150 : -150,
          transition: { 
            type: "spring",
            stiffness: 800, 
            damping: 10
          }
        });
        await debouncedOnSwipe(direction);
        controls.set({ x: 0 });
      } else {
        controls.start({ x: 0 });
      }
    }
  };

  return {
    controls,
    handleDragEnd,
    isLoading
  };
};
