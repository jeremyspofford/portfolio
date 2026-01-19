"use client";

import { useEffect, useState, useRef } from "react";

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export function Typewriter({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);
  const mountedRef = useRef(true);

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Blinking cursor effect - using setInterval instead of recursive setTimeout
  useEffect(() => {
    const interval = setInterval(() => {
      if (mountedRef.current) {
        setBlink((prev) => !prev);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []); // Empty dependency - runs once

  useEffect(() => {
    if (words.length === 0) return;

    const timeout = setTimeout(() => {
      if (!mountedRef.current) return;

      if (isDeleting) {
        if (subIndex === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        } else {
          setSubIndex((prev) => prev - 1);
        }
      } else {
        if (subIndex === words[index].length + 1) {
          setIsDeleting(true);
        } else {
          setSubIndex((prev) => prev + 1);
        }
      }
    }, isDeleting ? deletingSpeed : (subIndex === words[index].length + 1 ? pauseTime : typingSpeed));

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index, words, pauseTime, typingSpeed, deletingSpeed]);

  return (
    <span className="inline-block min-w-[2ch]" aria-live="polite" aria-atomic="true">
      <span aria-label={words[index]}>{words[index]?.substring(0, subIndex)}</span>
      <span
        className={`${blink ? "opacity-100" : "opacity-0"} ml-1 text-primary`}
        aria-hidden="true"
      >
        |
      </span>
    </span>
  );
}
