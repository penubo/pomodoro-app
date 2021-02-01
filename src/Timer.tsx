import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import sample from './sample.wav';

function convertTimeFormat(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s}`;
}

const DEFAULT_TIME = 2;

const Timer = () => {
  const [timer, setTimer] = useState<number>(DEFAULT_TIME);
  const [isSprintOver, setIsSprintOver] = useState<boolean>(false);
  const audioRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      timerInterval = setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setIsSprintOver(true);
    }
    if (timerInterval) return () => clearTimeout(timerInterval!);
  }, [timer, setTimer]);

  useEffect(() => {
    if (isSprintOver && audioRef.current) {
      console.log('hello');
      audioRef.current.play();
    }
  }, [isSprintOver]);
  return (
    <div>
      <span>{convertTimeFormat(timer)}</span>
      <video autoPlay muted ref={audioRef}>
        <source src={sample} type="audio/wav" />
      </video>
    </div>
  );
};

export default Timer;
