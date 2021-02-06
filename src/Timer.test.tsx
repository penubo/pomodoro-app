import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import Timer from './Timer';

describe('Timer Test', () => {
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
});
