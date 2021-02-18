import React from 'react';
import { act, render, screen } from '@testing-library/react';
import TimerPage from './TimerPage';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { SinonFakeTimers, useFakeTimers } from 'sinon';

const WORK_TIME = 1500;
const SHORT_BREAK = 300;

describe('TimerPage Test', () => {
  let clock: SinonFakeTimers;

  beforeEach(() => {
    clock = useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    clock.restore();
  });

  function passTime(sec: number) {
    for (let i = 0; i < sec; i++) {
      act(() => {
        clock.tick('00:01');
      });
    }
  }

  function passWorkTime() {
    passTime(WORK_TIME);
  }
  function passShortBreak() {
    passTime(SHORT_BREAK);
  }

  it('should render new button for creating todo list', () => {
    render(<TimerPage />);
    screen.getByRole('button', { name: /new/i });
  });

  it('should render input for naming title for new todo list', () => {
    render(<TimerPage />);
    screen.getByRole('textbox', { name: /todo-title/i });
  });

  it('should render controller for setting sprint of new todo', () => {
    render(<TimerPage />);
    screen.getByRole('spinbutton', { name: /todo-sprint/i });
    screen.getByRole('button', { name: /sprint-set-up/i });
    screen.getByRole('button', { name: /sprint-set-down/i });
  });

  it('should control sprint selection by up and down button', () => {
    render(<TimerPage />);
    const sprintUpButton = screen.getByRole('button', {
      name: /sprint-set-up/i,
    });
    const sprintDownButton = screen.getByRole('button', {
      name: /sprint-set-down/i,
    });
    const sprintSelection = screen.getByRole('spinbutton', {
      name: /todo-sprint/i,
    }) as HTMLInputElement;
    console.dir(sprintSelection);
    userEvent.click(sprintUpButton);
    expect(sprintSelection.value).to.equal('1');
    userEvent.click(sprintDownButton);
    expect(sprintSelection.value).to.equal('0');
  });

  it('should add new todo item when fill the title, sprint and clicks new button', () => {
    render(<TimerPage />);
    const newTitle = 'newTitle';
    const newButton = screen.getByRole('button', { name: /new/i });
    const titleInput = screen.getByRole('textbox', { name: /todo-title/i });
    const sprintUpButton = screen.getByRole('spinbutton', {
      name: /todo-sprint/i,
    });
    userEvent.type(titleInput, newTitle);
    userEvent.click(sprintUpButton);
    userEvent.click(newButton);
    const todo = screen.getByLabelText(/todo-item/i);
    expect(todo).to.be.exist;
    expect(screen.getByText(newTitle)).to.be.exist;
  });

  it('should render breaking session after pomodoro session complete', () => {
    render(<TimerPage />);
    const startButton = screen.getByRole('button', {
      name: 'start',
    });
    userEvent.click(startButton);
    for (let i = 0; i < 1500; i++) {
      act(() => {
        clock.tick('00:01');
      });
    }
    // should query timer after time passed because it is re mounted using key props
    const breakingTimer = screen.getByLabelText(/timer/i);
    expect(breakingTimer.innerText).to.equal('05:00');
  });

  it('should render long breaking session after 4 pomodoro session complete', () => {
    render(<TimerPage />);
    const startButton = screen.getByRole('button', { name: 'start' });
    userEvent.click(startButton);
    passWorkTime(); // 1 session
    passShortBreak();
    passWorkTime(); // 2 session
    passShortBreak();
    passWorkTime(); // 3 session
    passShortBreak();
    passWorkTime(); // 4 session
    const longBreakingTimer = screen.getByLabelText(/timer/i);
    expect(longBreakingTimer.innerText).to.equal('15:00');
  });
});
