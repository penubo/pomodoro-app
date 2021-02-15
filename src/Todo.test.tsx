import React from 'react';
import { render, screen } from '@testing-library/react';
import Todo from './Todo';
import { expect } from 'chai';

describe('Todo Test', () => {
  it('should render correct amount of todo lists', () => {
    const todos = [
      { id: 0, title: 'task1', sprint: 2 },
      { id: 1, title: 'task2', sprint: 2 },
      { id: 2, title: 'task3', sprint: 2 },
    ];
    render(<Todo todos={todos} />);
    const todoComponents = screen.getAllByLabelText(/todo item/i);
    expect(todoComponents.length).to.equal(3);
  });
});
