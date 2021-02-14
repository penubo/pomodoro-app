import React, { useState, useEffect, createContext, useContext } from 'react';

function convertTimeFormat(sec: number) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

interface TimerProps {
  initialTime: number;
  onTimeEnd?: Function;
}

type TimerContextProps = {
  start: () => void;
  stop: () => void;
  working: boolean;
};
const TimerContext = createContext<TimerContextProps | null>(null);

function TimerProvider({ children }: { children: React.ReactNode }) {
  const [working, setWorking] = useState<boolean>(false);
  const start = () => {
    setWorking(true);
  };
  const stop = () => {
    setWorking(false);
  };
  return (
    <TimerContext.Provider value={{ start, stop, working }}>
      {children}
    </TimerContext.Provider>
  );
}

function useTimer() {
  const context = useContext(TimerContext);
  if (context === null) {
    throw new Error(
      'You should use useTimer hook inside TimerProvider component',
    );
  }
  const { start, stop, working } = context;
  return { start, stop, working };
}

function Timer({ initialTime, onTimeEnd }: TimerProps) {
  const [timer, setTimer] = useState<number>(initialTime);
  const { working } = useTimer();

  useEffect(() => {
    let tr: NodeJS.Timeout | number | null = null;
    if (timer <= 0) {
      if (onTimeEnd !== undefined) onTimeEnd();
    }
    if (working && timer > 0)
      tr = setTimeout(() => setTimer((t) => t - 1), 1000);
    if (tr !== null) return () => clearTimeout(tr as NodeJS.Timeout);
  }, [timer, setTimer, working]);

  return (
    <div>
      <span aria-label="timer">{convertTimeFormat(timer)}</span>
    </div>
  );
}

function TimerStartButton() {
  const { start } = useTimer();

  return <button onClick={start}> start </button>;
}

function TimerStopButton() {
  const { stop } = useTimer();

  return <button onClick={stop}> stop </button>;
}
export default Timer;
export { TimerProvider, TimerStartButton, TimerStopButton, useTimer };
