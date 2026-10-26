import { useEffect, useRef, useState } from "react";

type Props = {
  initialMs: number;
  /** 남은 시간을 갱신하는 주기(ms). 기본값 1000. 주기를 바꿔도 전체 시간은 initialMs 그대로다. */
  interval?: number;
  autoStart?: boolean;
  onComplete?: () => void;
};

export default function useTimer({
  initialMs,
  interval = 1000,
  onComplete,
  autoStart = false,
}: Props) {
  // 남은 시간을 ms 로 들고, interval 마다 interval 만큼 줄인다.
  // (예전에는 interval 마다 1초씩 줄여서 interval: 500 이면 시간이 두 배로 빨리 흘렀다)
  const [remainingMs, setRemainingMs] = useState<number>(Math.max(initialMs, 0));
  const [isRunning, setIsRunning] = useState<boolean>(
    autoStart && initialMs > 0
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const onReset = () => {
    setIsRunning(false);
    setRemainingMs(Math.max(initialMs, 0));
  };

  const setTime = (ms: number) => {
    setRemainingMs(Math.max(ms, 0));
  };

  const isFinished = remainingMs <= 0;

  useEffect(() => {
    if (!isRunning || isFinished) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingMs((prev) => Math.max(prev - interval, 0));
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isFinished, interval]);

  useEffect(() => {
    if (isRunning && isFinished) {
      setIsRunning(false);
      onCompleteRef.current?.();
    }
  }, [isRunning, isFinished]);

  return {
    /** 남은 시간(초). 1초 미만이 남아도 0 이 되기 전까지는 올림해서 보여준다. */
    timeSeconds: Math.ceil(remainingMs / 1000),
    /** 남은 시간(ms) */
    timeMs: remainingMs,
    isRunning,
    onStart: () => {
      if (remainingMs > 0) setIsRunning(true);
    },
    onPause: () => setIsRunning(false),
    onReset,
    setTime,
  };
}
