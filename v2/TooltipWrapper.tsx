import React, { ReactNode, useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "framer-motion";

import OutsideClickHandler from "./OutsideClickHandler";
import DefaultTooltip from "./DefaultTooltip";

type Placement = "top" | "bottom" | "left" | "right";
type OpenOn = "hover" | "click";

interface TooltipWrapperProps {
  children: ReactNode;
  position?: Placement;
  tooltipType?: React.ComponentType<any>;
  data: unknown;
  delay?: number;
  disabled?: boolean;
  openOn?: OpenOn;
  className?: string;
}

export default function TooltipWrapper({
  children,
  position = "top",
  tooltipType = DefaultTooltip,
  data,
  delay = 0.5,
  disabled = false,
  openOn = "hover",
  className = "",
}: TooltipWrapperProps) {
  const [open, setOpen] = useState(false);

  const { refs, x, y, strategy } = useFloating({
    placement: position,
    middleware: [offset(16), flip(), shift({ padding: 5 })],
    whileElementsMounted: autoUpdate,
  });

  const pullAwayMap: Record<Placement, { x?: number; y?: number }> = {
    top: { y: 12 },
    bottom: { y: -12 },
    left: { x: 12 },
    right: { x: -12 },
  };

  const pullAway = pullAwayMap[position];

  const triggerProps: Record<string, unknown> = {};

  if (!disabled) {
    if (openOn === "hover") {
      triggerProps.onMouseEnter = () => setOpen(true);
      triggerProps.onMouseLeave = () => setOpen(false);
    } else if (openOn === "click") {
      triggerProps.onClick = () => setOpen((prev) => !prev);
    }
  }

  const triggerNode = (
    <div className={className} ref={refs.setReference} {...triggerProps}>
      {children}
    </div>
  );

  const tooltipNode = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={refs.setFloating}
          initial={{ opacity: 0, scale: 0.9, ...pullAway }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, ...pullAway }}
          transition={{ duration: 0.2, delay, ease: "easeInOut" }}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          className="z-[9999] pointer-events-none"
        >
          {React.createElement(tooltipType, { data })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (disabled) {
    return triggerNode;
  }

  if (openOn === "click") {
    return (
      <OutsideClickHandler
        onOutsideClick={() => setOpen(false)}
        exceptionRefs={[refs.reference, refs.floating]}
        isActive={open}
      >
        {triggerNode}
        {tooltipNode}
      </OutsideClickHandler>
    );
  }

  return (
    <>
      {triggerNode}
      {tooltipNode}
    </>
  );
}
