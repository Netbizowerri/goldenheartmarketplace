import * as React from "react";
import { cn } from "@/src/lib/utils";

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackLabel?: string;
  fallbackClassName?: string;
};

export function SafeImage({
  alt,
  className,
  fallbackLabel,
  fallbackClassName,
  src,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gray-100 text-center text-xs font-bold uppercase tracking-[0.2em] text-medium-grey",
          className,
          fallbackClassName,
        )}
        aria-label={alt}
        role="img"
      >
        {fallbackLabel || alt || "Image unavailable"}
      </div>
    );
  }

  return <img {...props} alt={alt} className={className} src={src} onError={() => setHasError(true)} />;
}
