import { useMemo, useRef, useState } from 'react';
import { calculateLiveMetrics } from '../utils/metrics';

export function useTypingSession(sourceText) {
  const [typedText, setTypedText] = useState('');
  const [status, setStatus] = useState('idle');
  const [startTime, setStartTime] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const intervalRef = useRef(null);

  const metrics = useMemo(
    () => calculateLiveMetrics({ sourceText, typedText, durationMs, backspaceCount }),
    [sourceText, typedText, durationMs, backspaceCount]
  );

  const start = () => {
    setStatus('active');
    const now = Date.now();
    setStartTime(now);
    intervalRef.current = setInterval(() => {
      setDurationMs(Date.now() - now);
    }, 200);
  };

  const finish = () => {
    clearInterval(intervalRef.current);
    setStatus('finished');
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setTypedText('');
    setDurationMs(0);
    setBackspaceCount(0);
    setStatus('idle');
    setStartTime(0);
  };

  const trackInput = (value, inputType) => {
    if (inputType === 'deleteContentBackward') {
      setBackspaceCount((count) => count + 1);
    }
    setTypedText(value);
  };

  return {
    typedText,
    status,
    startTime,
    durationMs,
    backspaceCount,
    metrics,
    start,
    finish,
    reset,
    trackInput
  };
}
