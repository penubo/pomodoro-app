import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SinonFakeTimers, useFakeTimers, spy } from 'sinon';
import { expect } from 'chai';
import Timer, {
  TimerProvider,
  TimerStartButton,
  TimerStopButton,
} from './Timer';

describe('Timer Test', () => {
  let clock: SinonFakeTimers;
  const Wrapper = (props: any) => {
    return <TimerProvider {...props} />;
  };

  beforeEach(() => {
    clock = useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should render timer', () => {
    render(<Timer initialTime={1500} />, { wrapper: Wrapper });
    screen.getByLabelText('timer');
  });

  it('should render time as HH:MM format by given time', () => {
    render(<Timer initialTime={1500} />, { wrapper: Wrapper });
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    // 1500sec == 25min 00sec
    expect(timer.innerText).to.equal('25:00');
  });

  it('should not ticking pomodoro time unless user clicks start button', async () => {
    render(<Timer initialTime={1500} />, { wrapper: Wrapper });

    clock.tick('00:01');
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    // wait for one second
    expect(timer.innerText).to.equal('25:00');
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
    const startButton = screen.getByRole('button', { name: 'start' });
    const stopButton = screen.getByRole('button', { name: 'stop' });
    userEvent.click(startButton);
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    act(() => {
      clock.tick('00:01');
    });
    expect(timer.innerText).to.equal('24:59');
    userEvent.click(stopButton);
    act(() => {
      clock.tick('00:01');
    });
    expect(timer.innerText).to.equal('24:59');
  });

  it('should raise end event when running time is completed', () => {
    const timeEndHandler = spy();
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
    for (let i = 0; i < 1; i++) {
      act(() => {
        clock.tick('00:01');
      });
    }
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    expect(timer.innerText).to.equal('00:00');
    expect(timeEndHandler.called).to.equal(true);
  });

  it('should not exceed 00:00 time when running pomodoro', () => {
    render(
      <>
        <Timer initialTime={1} />
        <TimerStartButton />
      </>,
      { wrapper: Wrapper },
    );
    const startButton = screen.getByRole('button', {
      name: 'start',
    });
    userEvent.click(startButton);
    for (let i = 0; i < 2; i++) {
      act(() => {
        clock.tick('00:01');
      });
    }
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    expect(timer.innerText).to.equal('00:00');
  });
});
