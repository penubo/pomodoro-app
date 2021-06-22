import React from 'react';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Timer, {
  TimerProvider,
  TimerStartButton,
  TimerStopButton,
} from './Timer';

describe('Timer Test', () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  const Wrapper = (props: any) => {
    return <TimerProvider {...props} />;
  };

  it('should render time as HH:MM format by given time', () => {
    render(<Timer initialTime={1500} />, {wrapper: Wrapper});
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    // 1500sec == 25min 00sec
    expect(timer).toHaveTextContent('25:00');
  });

  it('should not ticking pomodoro time unless user clicks start button', async () => {
    render(<Timer initialTime={1500} />, {wrapper: Wrapper});

    //clock.tick('00:01');
    jest.advanceTimersByTime(1000);
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    expect(timer).toHaveTextContent('25:00');
  });

  it('should stop ticking after press stop button', () => {
    render(
      <>
        <Timer initialTime={1500} />
        <TimerStartButton />
        <TimerStopButton />
      </>,
      {
        wrapper: Wrapper,
      },
    );
    const startButton = screen.getByRole('button', {name: 'start'});
    const stopButton = screen.getByRole('button', {name: 'stop'});
    userEvent.click(startButton);
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(timer).toHaveTextContent('24:59');
    userEvent.click(stopButton);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(timer).toHaveTextContent('24:59');
  });

  it('should raise end event when running time is completed', () => {
    const timeEndHandler = jest.fn();
    render(
      <>
        <Timer initialTime={1} onTimeEnd={timeEndHandler} />
        <TimerStartButton />
      </>,
      {
        wrapper: Wrapper,
      },
    );
    const startButton = screen.getByRole('button', {
      name: 'start',
    });
    userEvent.click(startButton);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    expect(timer).toHaveTextContent('00:00');
    expect(timeEndHandler).toHaveBeenCalledTimes(1);
  });

  it('should not exceed 00:00 time when running pomodoro', () => {
    render(
      <>
        <Timer initialTime={1} />
        <TimerStartButton />
      </>,
      {wrapper: Wrapper},
    );
    const startButton = screen.getByRole('button', {
      name: 'start',
    });
    userEvent.click(startButton);
    for (let i = 0; i < 2; i++) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    expect(timer).toHaveTextContent('00:00');
  });
});
