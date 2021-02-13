import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SinonFakeTimers, useFakeTimers } from 'sinon';
import { expect } from 'chai';
import Timer from './Timer';

describe('Timer Test', () => {
  let clock: SinonFakeTimers;

  beforeEach(() => {
    clock = useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should render start, stop button', () => {
    render(<Timer initialTime={1500} />);
    screen.getByRole('button', { name: 'start' });
    screen.getByRole('button', { name: 'stop' });
  });

  it('should render timer', () => {
    render(<Timer initialTime={1500} />);
    screen.getByLabelText('timer');
  });

  it('should render time as HH:MM format by given time', () => {
    render(<Timer initialTime={1500} />);
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    // 1500sec == 25min 00sec
    expect(timer.innerText).to.equal('25:00');
  });

  it('should not ticking pomodoro time unless user clicks start button', async () => {
    render(<Timer initialTime={1500} />);

    clock.tick('00:01');
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    // wait for one second
    expect(timer.innerText).to.equal('25:00');
  });

  it('should start ticking after press start button', async () => {
    render(<Timer initialTime={1500} />);
    const startButton = screen.getByRole('button', { name: 'start' });
    userEvent.click(startButton);
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    clock.tick('00:01');
    await waitFor(() => expect(timer.innerText).to.equal('24:59'));
  });

  it('should stop ticking after press stop button', async () => {
    render(<Timer initialTime={1500} />);
    const startButton = screen.getByRole('button', { name: 'start' });
    const stopButton = screen.getByRole('button', { name: 'stop' });
    userEvent.click(startButton);
    const timer: HTMLSpanElement = screen.getByLabelText('timer');
    clock.tick('00:01');
    await waitFor(() => expect(timer.innerText).to.equal('24:59'));
    userEvent.click(stopButton);
    clock.tick('00:01');
    expect(timer.innerText).to.equal('24:59');
  });
});
