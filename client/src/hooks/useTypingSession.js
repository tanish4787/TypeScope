import { useMemo, useRef, useState } from "react";
import { calculateLiveMetrics } from "../utils/metrics";

const IDLE_THRESHOLD_MS = 1500;

export function useTypingSession(sourceText) {
  const [typedText, setTypedText] = useState("");
  const [status, setStatus] = useState("idle");
  const [activeDurationMs, setActiveDurationMs] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);

  const intervalRef = useRef(null);
  const lastTickRef = useRef(0);
  const lastInputTimeRef = useRef(0);

  const metrics = useMemo(
    () =>
      calculateLiveMetrics({
        sourceText,
        typedText,
        durationMs: activeDurationMs,
        backspaceCount,
      }),
    [sourceText, typedText, activeDurationMs, backspaceCount]
  );

  const start = () => {
    if (status === "active") return

    setStatus("active");
    setActiveDurationMs(0);

    const now = Date.now();
    lastTickRef.current = now;
    lastInputTimeRef.current = now;

    intervalRef.current = setInterval(() => {
      const current = Date.now();
      const delta = current - lastTickRef.current;
      lastTickRef.current = current;

      const timeSinceLastInput = current - lastInputTimeRef.current;

      if (timeSinceLastInput <= IDLE_THRESHOLD_MS) {
        setActiveDurationMs((t) => t + delta);
      }
    }, 200);
  };

  const finish = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus("finished");
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTypedText("");
    setActiveDurationMs(0);
    setBackspaceCount(0);
    setStatus("idle");
    lastTickRef.current = 0;
    lastInputTimeRef.current = 0;
  };

  const trackInput = (value, inputType) => {
    if (status !== "active") return;
    const now = Date.now();
    lastInputTimeRef.current = now;

    if (inputType === "deleteContentBackward") {
      setBackspaceCount((count) => count + 1);
    }
    setTypedText(value);
  };

  return {
    typedText,
    status,
    durationMs: activeDurationMs,
    backspaceCount,
    metrics,
    start,
    finish,
    reset,
    trackInput,
  };
}
