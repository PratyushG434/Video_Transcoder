import React, { useState } from "react";

export function Avatar({ className = "", children }) {
  return (
    <span
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    >
      {children}
    </span>
  );
}

export function AvatarImage({ src, alt, className = "" }) {
  const [imgSrc, setImgSrc] = useState(src);

  if (!imgSrc) return null;

  return (
    <img
      className={`aspect-square h-full w-full object-cover ${className}`}
      src={imgSrc}
      alt={alt || "Avatar"}
      onError={() => setImgSrc(undefined)} // trigger fallback
    />
  );
}

export function AvatarFallback({ className = "", children }) {
  return (
    <span
      className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
    >
      {children}
    </span>
  );
}
