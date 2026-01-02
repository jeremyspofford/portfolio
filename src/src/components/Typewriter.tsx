"use client";

import { useEffect, useState } from "react";

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

  // Blinking cursor effect
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (words.length === 0) return;

    const timeout = setTimeout(() => {
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
    <span className="inline-block min-w-[2ch]">
      {words[index]?.substring(0, subIndex)}
      <span className={`${blink ? "opacity-100" : "opacity-0"} ml-1 text-primary`}>|</span>
    </span>
  );
}
