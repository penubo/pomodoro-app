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
  const [ticking, setTicking] = useState<boolean>(false);

  const handleStart = () => {
    setTicking((p) => !p);
  };
  const handleStop = () => {
    setTicking((p) => !p);
  };

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (ticking === true && timer > 0) {
      timerInterval = setTimeout(() => setTimer(timer - 1), 1000);
    }
    if (ticking === false || timerInterval)
      return () => clearTimeout(timerInterval!);
  }, [timer, setTimer, ticking]);

  return (
    <div>
      <span aria-label="timer">{convertTimeFormat(timer)}</span>
      <button onClick={handleStart}>start</button>
      <button onClick={handleStop}>stop</button>
    </div>
  );
}

export default Timer;
