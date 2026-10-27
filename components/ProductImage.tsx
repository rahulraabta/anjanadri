"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

type ProductImageProps = Omit<ImageProps, "placeholder" | "blurDataURL"> & {
  blurDataURL: string;
};

export default function ProductImage({
  src,
  alt,
  blurDataURL,
  className,
  style,
  fill,
  onLoad,
  ...props
}: ProductImageProps) {
  const source = typeof src === "string" ? src : "default" in src ? src.default.src : src.src;
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const loaded = loadedSource === source;

  return (
    <>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 scale-110 bg-cover bg-center blur-sm transition-opacity duration-500 motion-reduce:duration-0 ${loaded ? "opacity-0" : "opacity-100"}`}
        style={{ backgroundImage: `url("${blurDataURL}")` }}
      />
      <Image
        {...props}
        key={source}
        src={src}
        alt={alt}
        fill={fill}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={`${className ?? ""} transition-opacity duration-500 motion-reduce:duration-0 ${loaded ? "opacity-100" : "opacity-0"}`}
        style={{ ...style, position: fill ? style?.position : "relative", transitionProperty: "opacity, transform" }}
        onLoad={(event) => {
          setLoadedSource(source);
          onLoad?.(event);
        }}
      />
    </>
  );
}
