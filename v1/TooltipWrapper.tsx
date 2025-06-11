"use client";

import React, { useRef, useState, useEffect, ReactNode } from "react";
import DefaultTooltip from "./DefaultTooltip";

type Placement = "top" | "bottom" | "left" | "right";

interface TooltipWrapperProps {
  children: ReactNode;
  position?: Placement;
  className?: string;
  tooltipType?: React.ComponentType<any>;
  data: { text: string };
}

export default function TooltipWrapper({
  children,
  position = "top",
  className = "",
  tooltipType: TooltipComponent = DefaultTooltip,
  data,
}: TooltipWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const updateTooltipPosition = () => {
    if (wrapperRef.current && tooltipRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      const positions: Record<Placement, { top: number; left: number }> = {
        top: {
          top: wrapperRect.top - tooltipRect.height,
          left:
            wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2,
        },
        bottom: {
          top: wrapperRect.bottom,
          left:
            wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2,
        },
        left: {
          top:
            wrapperRect.top + wrapperRect.height / 2 - tooltipRect.height / 2,
          left: wrapperRect.left - tooltipRect.width,
        },
        right: {
          top:
            wrapperRect.top + wrapperRect.height / 2 - tooltipRect.height / 2,
          left: wrapperRect.right,
        },
      };

      setTooltipPosition(positions[position]);
    }
  };

  useEffect(() => {
    updateTooltipPosition();
    window.addEventListener("resize", updateTooltipPosition);
    return () => {
      window.removeEventListener("resize", updateTooltipPosition);
    };
  }, [position]);

  const getTranslateClass = () => {
    const translations: Record<Placement, string> = {
      top: "group-hover:-translate-y-4",
      bottom: "group-hover:translate-y-4",
      left: "group-hover:-translate-x-4",
      right: "group-hover:translate-x-4",
    };
    return translations[position];
  };

  return (
    <div className="relative group" ref={wrapperRef}>
      {children}
      <TooltipComponent
        ref={tooltipRef}
        data={data}
        className={`fixed z-[9999] opacity-0 group-hover:opacity-100 pointer-events-none ${className} ${getTranslateClass()}`}
        style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
      />
    </div>
  );
}
