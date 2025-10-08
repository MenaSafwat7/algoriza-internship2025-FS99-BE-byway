import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = "",
  label,
  className = ""
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const start = 0;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.floor(easedProgress * (end - start) + start);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isVisible, end, duration]);

  return (
    <div ref={counterRef} className={`text-center ${className}`}>
      <div className="text-4xl font-bold text-gray-900 mb-2">
        {count}{suffix}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

export default AnimatedCounter;
