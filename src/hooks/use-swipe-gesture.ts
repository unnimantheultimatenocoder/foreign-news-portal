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
    const swipeThreshold = 40;
    const swipeVelocityThreshold = 100;

    if (isMobile) {
      const direction = info.offset.y > 0 ? "down" : "up";
      const meetsSwipeCriteria =
        Math.abs(info.offset.y) > swipeThreshold ||
        Math.abs(info.velocity.y) > swipeVelocityThreshold;

      if (meetsSwipeCriteria) {
        const displacement = Math.min(
          Math.max(Math.abs(info.velocity.y) * 0.5, 150),
          300
        );

        await controls.start({
          y: info.offset.y > 0 ? displacement : -displacement,
          transition: {
            type: "spring",
            stiffness: 800,
            damping: 45,
            mass: 0.8,
            velocity: info.velocity.y * 1.5,
            restSpeed: 1000.005,
            restDelta: 0.5
          }
        });
        await debouncedOnSwipe(direction);
        await controls.start({
          y: 0,
          transition: {
            type: "spring",
            stiffness: 800,
            damping: 45,
            mass: 0.8,
            restSpeed: 1000.005,
            restDelta: 0.5
          }
        });
      } else {
        controls.start({
          y: 0,
          transition: {
            type: "spring",
            stiffness: 800,
            damping: 45,
            mass: 0.8,
            restSpeed: 1000.005,
            restDelta: 0.5
          }
        });
      }
    } else {
      const direction = info.offset.x > 0 ? "right" : "left";
      const meetsSwipeCriteria =
        Math.abs(info.offset.x) > swipeThreshold ||
        Math.abs(info.velocity.x) > swipeVelocityThreshold;

      if (meetsSwipeCriteria) {
        const displacement = Math.min(
          Math.max(Math.abs(info.velocity.x) * 0.5, 150),
          300
        );

        await controls.start({
          x: info.offset.x > 0 ? displacement : -displacement,
          transition: {
            type: "spring",
            stiffness: 800,
            damping: 45,
            mass: 0.8,
            velocity: info.velocity.x * 1.5,
            restSpeed: 1000.005,
            restDelta: 0.5
          }
        });
        await debouncedOnSwipe(direction);
        await controls.start({
          x: 0,
          transition: {
            type: "spring",
            stiffness: 800,
            damping: 45,
            mass: 0.8,
            restSpeed: 1000.005,
            restDelta: 0.5
          }
        });
      } else {
        controls.start({
          x: 0,
          transition: {
            type: "spring",
            stiffness: 800,
            damping: 45,
            mass: 0.8,
            restSpeed: 1000.005,
            restDelta: 0.5
          }
        });
      }
    }
  };

  return {
    controls,
    handleDragEnd,
    isLoading
  };
};
