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
  // 같은 핸들러 안에서 onReset() 직후 onStart() 를 불러도 리셋된 값을 볼 수 있도록 최신 남은 시간을 ref 로도 들고 있는다.
  // (state 만 보면 onStart 가 리셋 전 값(만료 후 0)을 읽어 시작하지 않는다)
  const remainingMsRef = useRef<number>(remainingMs);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const updateRemainingMs = (ms: number) => {
    const next = Math.max(ms, 0);
    remainingMsRef.current = next;
    setRemainingMs(next);
  };

  const onReset = () => {
    setIsRunning(false);
    updateRemainingMs(initialMs);
  };

  const setTime = (ms: number) => {
    updateRemainingMs(ms);
  };

  const isFinished = remainingMs <= 0;

  useEffect(() => {
    if (!isRunning || isFinished) {
      return;
    }

    intervalRef.current = setInterval(() => {
      updateRemainingMs(remainingMsRef.current - interval);
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
      if (remainingMsRef.current > 0) setIsRunning(true);
    },
    onPause: () => setIsRunning(false),
    onReset,
    setTime,
  };
}
