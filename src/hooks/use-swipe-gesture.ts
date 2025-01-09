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
        x: info.offset.x > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.3 }
      });
      onSwipe(direction);
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  return {
    controls,
    handleDragEnd
  };
};