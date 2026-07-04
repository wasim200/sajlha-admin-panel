"use client";
import { useState, useEffect } from "react";

export default function AnimatedCounter({ value, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = parseInt(value) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    const duration = 1400;
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeProgress * end);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    }

    requestAnimationFrame(updateCount);
  }, [value]);

  return (
    <span className="animated-counter">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
