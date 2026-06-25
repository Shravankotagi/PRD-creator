"use client";

import React, { useEffect, useRef, useState } from "react";

interface StreamingTextProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

export function StreamingText({
  text,
  speed = 18,
  className = "",
  onComplete,
  showCursor = true,
}: StreamingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevTextRef = useRef("");

  useEffect(() => {
    // Reset if text changed entirely
    if (text !== prevTextRef.current && !text.startsWith(prevTextRef.current)) {
      setDisplayed("");
      setDone(false);
      indexRef.current = 0;
    }
    prevTextRef.current = text;

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (indexRef.current >= text.length) {
      setDone(true);
      onComplete?.();
      return;
    }

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        clearInterval(intervalRef.current!);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed]);

  return (
    <span className={`inline ${className}`}>
      {displayed}
      {showCursor && !done && (
        <span
          aria-hidden="true"
          className="inline-block w-[2px] h-[1em] ml-[1px] bg-current align-middle animate-[blink_0.9s_step-end_infinite]"
          style={{
            animation: "blink 0.9s step-end infinite",
          }}
        />
      )}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}