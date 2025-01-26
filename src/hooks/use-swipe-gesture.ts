import { useAnimation, PanInfo } from "framer-motion";

interface UseSwipeGestureProps {
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
  isMobile?: boolean;
}

export const useSwipeGesture = ({ onSwipe, isMobile = false }: UseSwipeGestureProps) => {
  const controls = useAnimation();

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 60; // Further reduced threshold for even faster response
    const swipeVelocityThreshold = 150; // Lower velocity threshold for more responsive swipes
    
    // For mobile, we only use vertical swipes (up/down)
    if (isMobile) {
      const direction = info.offset.y > 0 ? "down" : "up";
      const meetsSwipeCriteria =
        Math.abs(info.offset.y) > swipeThreshold ||
        Math.abs(info.velocity.y) > swipeVelocityThreshold;
      
      if (meetsSwipeCriteria && onSwipe) {
        // Calculate dynamic displacement based on velocity
        const displacement = Math.min(
          Math.max(Math.abs(info.velocity.y) * 0.35, 120),
          250
        );
        
        await controls.start({
          y: info.offset.y > 0 ? displacement : -displacement,
          transition: {
            type: "spring",
            velocity: info.velocity.y,
            stiffness: 250,
            damping: 20
          }
        });
        onSwipe(direction);
        controls.set({ y: 0 });
      } else {
        // Smoother return animation for cancelled swipes
        controls.start({
          y: 0,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 20
          }
        });
      }
    } else {
      // For desktop, we use horizontal swipes (left/right)
      const direction = info.offset.x > 0 ? "right" : "left";
      
      if (Math.abs(info.offset.x) > swipeThreshold && onSwipe) {
        await controls.start({
          x: info.offset.x > 0 ? 150 : -150,
          transition: { duration: 0.15 }
        });
        onSwipe(direction);
        controls.set({ x: 0 });
      } else {
        controls.start({ x: 0 });
      }
    }
  };

  return {
    controls,
    handleDragEnd
  };
};
