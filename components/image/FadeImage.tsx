"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { FALLBACK_BLUR } from "@/lib/blur-constants";
import { cn } from "@/lib/utils";

export interface FadeImageProps extends ImageProps {
  onLoad?: () => void;
}

export function FadeImage({
  src,
  alt,
  className,
  onLoad,
  onError,
  placeholder,
  blurDataURL,
  ...props
}: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const effectiveBlurDataURL =
    placeholder === "blur" && !blurDataURL ? FALLBACK_BLUR : blurDataURL;

  return (
    <div className="absolute inset-0 overflow-hidden bg-foreground/5">
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse bg-foreground/10"
          aria-hidden
        />
      )}
      <Image
        src={src}
        alt={alt}
        placeholder={placeholder}
        blurDataURL={effectiveBlurDataURL}
        className={cn(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={onError}
        {...props}
      />
    </div>
  );
}
