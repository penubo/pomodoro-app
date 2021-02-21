import React from 'react';
import { render, screen } from '@testing-library/react';
import Todo from './Todo';
import { build, fake, sequence } from '@jackfranklin/test-data-bot';
import { expect } from 'chai';
import type { TodoItem } from 'types/todo';

const todoBuilder = build<TodoItem>('Todo', {
  fields: {
    id: sequence(),
    title: fake((f) => f.name.title()),
    sprintTotal: fake((f) => f.random.number()),
    sprintEnded: 0,
  },
});
describe('Todo Test', () => {
  it('should render correct amount of todo lists', () => {
    const todos = [todoBuilder(), todoBuilder(), todoBuilder()];
    render(<Todo todos={todos} />);
    const todoComponents = screen.getAllByLabelText(/todo-item/i);
    expect(todoComponents.length).to.equal(3);
  });

  it('should render title of todo lists', () => {
    const todo1 = todoBuilder();
    const todo2 = todoBuilder();
    const todos = [todo1, todo2];
    render(<Todo todos={todos} />);
    expect(screen.getByText(todo1.title)).to.be.exist;
    expect(screen.getByText(todo2.title)).to.be.exist;
  });

  it('should render pomodoro sprint of todo lists', () => {
    const todo1 = todoBuilder();
    const todo2 = todoBuilder();
    const todos = [todo1, todo2];
    render(<Todo todos={todos} />);
    expect(screen.getByText(todo1.sprintTotal)).to.be.exist;
    expect(screen.getByText(todo2.sprintTotal)).to.be.exist;
  });
});
