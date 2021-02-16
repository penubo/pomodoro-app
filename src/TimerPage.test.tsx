import React from 'react';
import { render, screen } from '@testing-library/react';
import TimerPage from './TimerPage';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';

describe('TimerPage Test', () => {
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
    screen.getByLabelText(/sprint-selection/i);
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
    const sprintSelection = screen.getByLabelText(/sprint-selection/i);
    console.dir(sprintUpButton);
    userEvent.click(sprintUpButton);
    expect(sprintSelection.innerText).to.equal('1');
    userEvent.click(sprintDownButton);
    expect(sprintSelection.innerText).to.equal('0');
  });

  it.skip('should add new todo item when fill the title, sprint and clicks new button', () => {
    render(<TimerPage />);
    const newTitle = 'newTitle';
    const newButton = screen.getByRole('button', { name: /new/i });
    const titleInput = screen.getByRole('textbox', { name: /todo-title/i });
    const sprintUpButton = screen.getByLabelText(/sprint-set-up/i);
    userEvent.type(titleInput, newTitle);
    userEvent.click(sprintUpButton);
    userEvent.click(newButton);
    const todo = screen.getByLabelText(/todo-item/i);
    expect(todo).to.be.exist;
    expect(screen.getByText(newTitle)).to.be.exist;
  });
});
