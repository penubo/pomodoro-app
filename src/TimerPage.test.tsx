import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
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
    screen.getByRole('button', { name: /new todo/i });
  });

  it('should render todo form when user clicks new todo button', () => {
    render(<TimerPage />);
    userEvent.click(screen.getByText(/new todo/i));
    screen.getByRole('button', { name: /save/i });
    screen.getByLabelText(/title for new todo/i);
    screen.getByLabelText(/amount of sprint for new todo/i);
    screen.getByLabelText(/increase sprint/i);
    screen.getByLabelText(/decrease sprint/i);
    expect(screen.queryByText(/new todo/i)).to.not.exist;
  });

  it('hides New todo form after user save a new todo', () => {
    render(<TimerPage />);
    userEvent.click(screen.getByText(/new todo/i));
    const titleInput = screen.getByLabelText(/title for new todo/i);
    const sprintUpButton = screen.getByLabelText(/increase sprint/i);
    const saveButton = screen.getByRole('button', { name: /save/i });
    userEvent.type(titleInput, 'New Todo');
    userEvent.click(sprintUpButton);
    userEvent.click(saveButton);
    expect(screen.queryByRole('button', { name: /save/i })).to.not.exist;
    expect(screen.queryByLabelText(/title for new todo/i)).to.not.exist;
    expect(screen.queryByLabelText(/increase sprint/i)).to.not.exist;
    expect(screen.queryByLabelText(/decrease sprint/i)).to.not.exist;
  });

  it('should render new todo button when user cancle to create new todo', () => {
    render(<TimerPage />);
    userEvent.click(screen.getByText(/new todo/i));
    userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    screen.getByText(/new todo/i);
    expect(screen.queryByRole('button', { name: /save/i })).to.not.exist;
    expect(screen.queryByLabelText(/title for new todo/i)).to.not.exist;
    expect(screen.queryByLabelText(/increase sprint/i)).to.not.exist;
    expect(screen.queryByLabelText(/decrease sprint/i)).to.not.exist;
  });

  it('should control sprint selection by up and down button', () => {
    render(<TimerPage />);
    userEvent.click(screen.getByText(/new todo/i));
    const sprintUpButton = screen.getByLabelText(/increase sprint/i);
    const sprintDownButton = screen.getByLabelText(/decrease sprint/i);
    const sprintSelection = screen.getByLabelText(
      /amount of sprint for new todo/i,
    ) as HTMLInputElement;
    userEvent.click(sprintUpButton);
    expect(sprintSelection.value).to.equal('1');
    userEvent.click(sprintDownButton);
    expect(sprintSelection.value).to.equal('0');
  });

  it('should add new todo item when fill the title, sprint and clicks new button', () => {
    render(<TimerPage />);
    userEvent.click(screen.getByText(/new todo/i));
    const newTitle = 'newTitle';
    const saveFormButton = screen.getByRole('button', { name: /save/i });
    const titleInput = screen.getByLabelText(/title for new todo/i);
    const sprintUpButton = screen.getByLabelText(/increase sprint/i);
    userEvent.type(titleInput, newTitle);
    userEvent.click(sprintUpButton);
    userEvent.click(saveFormButton);
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
    passWorkTime();
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

  it('should increase done count when one sprint is done', async () => {
    render(<TimerPage />);
    userEvent.click(screen.getByText(/new todo/i));
    const newTitle = 'newTitle';
    const saveFormButton = screen.getByRole('button', { name: /save/i });
    const titleInput = screen.getByLabelText(/title for new todo/i);
    const sprintUpButton = screen.getByLabelText(/increase sprint/i);
    userEvent.type(titleInput, newTitle);
    userEvent.click(sprintUpButton);
    userEvent.click(saveFormButton);
    userEvent.click(screen.getByText(newTitle));
    expect(screen.getByText(/0 \/ 1/i));
    const startButton = screen.getByRole('button', { name: 'start' });
    userEvent.click(startButton);
    passWorkTime(); // 1 session
    await waitFor(() => expect(screen.getByText(/1 \/ 1/i)));
  });

  it('should remove todos when clicks delete button', () => {
    render(<TimerPage />);
    userEvent.click(screen.getByText(/new todo/i));
    const newTitle = 'newTitle';
    const saveFormButton = screen.getByRole('button', { name: /save/i });
    const titleInput = screen.getByLabelText(/title for new todo/i);
    const sprintUpButton = screen.getByLabelText(/increase sprint/i);
    userEvent.type(titleInput, newTitle);
    userEvent.click(sprintUpButton);
    userEvent.click(saveFormButton);
    const deleteButton = screen.getByLabelText(/delete/i);
    userEvent.click(deleteButton);
    expect(screen.queryByText(newTitle)).to.not.exist;
  });

  it('should render done when user clicks done button and it toggles', () => {
    render(<TimerPage />);
    userEvent.click(screen.getByText(/new todo/i));
    const newTitle = 'newTitle';
    const saveFormButton = screen.getByRole('button', { name: /save/i });
    const titleInput = screen.getByLabelText(/title for new todo/i);
    const sprintUpButton = screen.getByLabelText(/increase sprint/i);
    userEvent.type(titleInput, newTitle);
    userEvent.click(sprintUpButton);
    userEvent.click(saveFormButton);
    const todoNotDoneIconButton = screen.getByLabelText(/todo finish switch/i);
    userEvent.click(todoNotDoneIconButton);
    expect(screen.getByLabelText(/todo done/i)).to.exist;
    userEvent.click(todoNotDoneIconButton);
    expect(screen.queryByLabelText(/todo done/i)).to.not.exist;
  });

  it('can edit todo item on the list by edit button interface', () => {
    render(<TimerPage />);
    userEvent.click(screen.getByText(/new todo/i));
    const newTitle = 'newTitle';
    const saveFormButton = screen.getByRole('button', { name: /save/i });
    const titleInput = screen.getByLabelText(/title for new todo/i);
    const sprintUpButton = screen.getByLabelText(/increase sprint/i);
    userEvent.type(titleInput, newTitle);
    userEvent.click(sprintUpButton);
    userEvent.click(saveFormButton);
    const editTodoButton = screen.getByLabelText(/edit/i);
    userEvent.click(editTodoButton);
    const editTodoTitleInput = screen.getAllByLabelText(
      /title for new todo/i,
    )[0];
    const editTodoSprintUpButton = screen.getAllByLabelText(
      /increase sprint/i,
    )[0];
    const editedTitle = ' edited';
    const saveEditTodoButton = screen.getAllByRole('button', {
      name: /save/i,
    })[0];
    userEvent.type(editTodoTitleInput, editedTitle);
    userEvent.click(editTodoSprintUpButton);
    userEvent.click(saveEditTodoButton);
    expect(screen.getByText(newTitle + editedTitle)).to.exist;
    expect(screen.getByText(/0 \/ 2/i)).to.exist;
  });
});
