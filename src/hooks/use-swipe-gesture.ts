import { useAnimation, PanInfo } from "framer-motion";

interface UseSwipeGestureProps {
  onSwipe?: (direction: "left" | "right") => void;
}

export const useSwipeGesture = ({ onSwipe }: UseSwipeGestureProps) => {
  const controls = useAnimation();

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
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
  };

  return {
    controls,
    handleDragEnd
  };
};
