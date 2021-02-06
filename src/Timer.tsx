import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      timerInterval = setTimeout(() => setTimer(timer - 1), 1000);
    }
    if (timerInterval) return () => clearTimeout(timerInterval!);
  }, [timer, setTimer]);

  return (
    <div>
      <span aria-label="timer">{convertTimeFormat(timer)}</span>
      <button>start</button>
      <button>stop</button>
    </div>
  );
}

export default Timer;
