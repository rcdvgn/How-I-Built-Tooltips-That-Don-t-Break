"use client";

import { forwardRef } from "react";

interface DefaultTooltipProps {
  data: { text: string };
  className?: string;
  style?: React.CSSProperties;
}

const DefaultTooltip = forwardRef<HTMLDivElement, DefaultTooltipProps>(
  ({ data, className = "", style }, ref) => (
    <div
      ref={ref}
      className={`bg-[#1c1c1c] text-white font-medium text-xs p-2 rounded-[10px] ${className}`}
      style={style}
    >
      {data.text}
    </div>
  )
);

export default DefaultTooltip;
