import { useEffect, useRef, useState } from "react";

export default function useMountedRef() {
  const mounted = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    mounted.current = true;
    if (!isReady) {
      setIsReady(true);
    }

    return () => (mounted.current = false);
  }, [isReady]);

  return mounted;
}
