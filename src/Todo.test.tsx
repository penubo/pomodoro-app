import React from 'react';
import { render, screen } from '@testing-library/react';
import Todo from './Todo';
import { build, fake, sequence } from '@jackfranklin/test-data-bot';
import type { TodoItem } from 'types/todo';
import userEvent from '@testing-library/user-event';

const todoBuilder = build<TodoItem>('Todo', {
  fields: {
    id: sequence(),
    title: fake((f) => f.name.title()),
    sprintTotal: fake((f) => f.random.number()),
    sprintDone: 0,
    todoDone: fake((f) => f.random.boolean),
  },
});

describe('Todo Test', () => {
  it('should render correct amount of todo lists', () => {
    const todos = [todoBuilder(), todoBuilder(), todoBuilder()];
    render(<Todo todos={todos} />);
    const todoComponents = screen.getAllByLabelText(/todo-item/i);
    expect(todoComponents.length).toEqual(3);
  });

  it('should render title of todo lists', () => {
    const todo1 = todoBuilder();
    const todo2 = todoBuilder();
    const todos = [todo1, todo2];
    render(<Todo todos={todos} />);
    expect(screen.getByText(todo1.title)).toBeTruthy();
    expect(screen.getByText(todo2.title)).toBeTruthy();
  });

  it('should render pomodoro sprint of todo lists', () => {
    const todo1 = todoBuilder();
    const todo2 = todoBuilder();
    const todos = [todo1, todo2];
    render(<Todo todos={todos} />);
    expect(
      screen.getByText(`${todo1.sprintDone} / ${todo1.sprintTotal}`),
    ).toBeTruthy();
    expect(
      screen.getByText(`${todo2.sprintDone} / ${todo2.sprintTotal}`),
    ).toBeTruthy();
  });

  it('should render selected icon when clicks todoItem', () => {
    const todo1 = todoBuilder();
    const todos = [todo1];
    render(<Todo todos={todos} currentTodo={todo1.id} />);
    expect(screen.getByLabelText(/selected/i)).toBeTruthy();
  });

  it('should call onChangeCurrentTodo handler when clicks a todo item', () => {
    const todo1 = todoBuilder();
    const todos = [todo1];
    const changeCurrentTodoHandlerMock = jest.fn();
    render(
      <Todo todos={todos} onChangeCurrentTodo={changeCurrentTodoHandlerMock} />,
    );
    userEvent.click(screen.getByText(todo1.title));
    expect(changeCurrentTodoHandlerMock).toHaveReturnedTimes(1);
    expect(changeCurrentTodoHandlerMock).toHaveBeenCalledWith(todo1.id);
  });

  it('should render form when clicks edit button for a todo item', async () => {
    const todo1 = todoBuilder();
    render(<Todo todos={[todo1]} />);
    const editTodoButton = screen.getByLabelText(/edit/i);
    userEvent.click(editTodoButton);
    screen.getByRole('button', { name: /save/i });
    screen.getByLabelText(/increase sprint/i);
    screen.getByLabelText(/decrease sprint/i);
    const editTodoTitle = screen.getByLabelText(
      /title for new todo/i,
    ) as HTMLInputElement;
    const editTodoSprint = screen.getByLabelText(
      /amount of sprint for new todo/i,
    ) as HTMLInputElement;
    expect(editTodoTitle.value).toEqual(todo1.title);
    expect(editTodoSprint.value).toEqual(String(todo1.sprintTotal));
    userEvent.click(editTodoButton);
    expect(screen.queryByRole('button', { name: /save/i })).toBeFalsy();
    expect(screen.queryByLabelText(/increase sprint/i)).toBeFalsy();
    expect(screen.queryByLabelText(/decrease sprint/i)).toBeFalsy();
    expect(screen.queryByLabelText(/title for new todo/i)).toBeFalsy();
    expect(
      screen.queryByLabelText(/amount of sprint for new todo/i),
    ).toBeFalsy();
  });

  it('should disappear when user clicks new button on edit todo form', () => {
    const todo1 = todoBuilder();
    render(<Todo todos={[todo1]} />);
    const editTodoButton = screen.getByLabelText(/edit/i);
    userEvent.click(editTodoButton);
    const saveButton = screen.getByRole('button', { name: /save/i });
    userEvent.click(saveButton);
    expect(screen.queryByLabelText(/increase sprint/i)).toBeFalsy();
    expect(screen.queryByLabelText(/decrease sprint/i)).toBeFalsy();
    expect(screen.queryByLabelText(/title for new todo/i)).toBeFalsy();
    expect(
      screen.queryByLabelText(/amount of sprint for new todo/i),
    ).toBeFalsy();
  });
});
