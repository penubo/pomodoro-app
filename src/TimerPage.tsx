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
        <Timer initialTime={1500} />
        <TimerStartButton />
        <TimerStopButton />
      </TimerProvider>
    </div>
  );
}

export default TimerPage;
