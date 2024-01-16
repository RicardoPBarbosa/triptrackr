import { useEffect, useRef } from "react";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function LoadMoreTrigger({ trigger }: { trigger: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isVisible) {
      trigger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return <div ref={ref} className="h-2" />;
}
