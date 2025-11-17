'use client';

import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { formatCurrency } from '@/lib/utils';

export interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  currency?: boolean;
  currencyCode?: string;
  className?: string;
  triggerOnce?: boolean;
}

const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  currency = false,
  currencyCode = 'USD',
  className = '',
  triggerOnce = true,
}) => {
  const [count, setCount] = useState(start);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce,
  });

  useEffect(() => {
    if (!inView) {
      if (!triggerOnce) setCount(start);
      return;
    }

    let startTime: number | null = null;
    const startValue = start;
    const endValue = end;
    const difference = endValue - startValue;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = startValue + difference * easeOut;

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, start, end, duration, triggerOnce]);

  const formatValue = (value: number) => {
    if (currency) {
      return formatCurrency(Math.round(value), currencyCode);
    }
    
    const formatted = value.toFixed(decimals);
    return `${prefix}${formatted}${suffix}`;
  };

  return (
    <span ref={ref} className={className}>
      {formatValue(count)}
    </span>
  );
};

export default CountUp;
