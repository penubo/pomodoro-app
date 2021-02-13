import React, { useState, useEffect, useRef } from 'react';

function convertTimeFormat(sec: number) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

interface TimerProps {
  initialTime: number;
}

function Timer({ initialTime }: TimerProps) {
  const [timer, setTimer] = useState<number>(initialTime);
  const [ticking, setTicking] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = () => {
    setTicking((p) => !p);
    timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
  };
  const handleStop = () => {
    setTicking((p) => !p);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div>
      <span aria-label="timer">{convertTimeFormat(timer)}</span>
      <button onClick={handleStart}>start</button>
      <button onClick={handleStop}>stop</button>
    </div>
  );
}

export default Timer;
