import React from 'react';
import Timer, {
  TimerProvider,
  TimerStartButton,
  TimerStopButton,
} from './Timer';

function TimerPage() {
  return (
    <div>
      <TimerProvider>
        <TimerStartButton />
        <TimerStopButton />
        <Timer initialTime={1500} />
      </TimerProvider>
    </div>
  );
}

export default TimerPage;
