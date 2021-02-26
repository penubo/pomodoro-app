import React from 'react';
import type { TodoList } from 'types/todo';

interface TodoProps {
  todos: TodoList;
  onChangeCurrentTodo?: (newTodo: number) => void;
  onDeleteTodo?: (todoId: number) => void;
  onDoneTodo?: (todoId: number) => void;
  currentTodo?: number | null;
}

function Todo({
  todos = [],
  onChangeCurrentTodo,
  onDeleteTodo,
  onDoneTodo,
  currentTodo = 0,
}: TodoProps) {
  const handleClickTodoItem = (newTodo: number) => () => {
    if (onChangeCurrentTodo) onChangeCurrentTodo(newTodo);
  };

  const handleDelete = (todoId: number) => () => {
    if (onDeleteTodo) onDeleteTodo(todoId);
  };

  const handleDone = (todoId: number) => (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    if (onDoneTodo) onDoneTodo(todoId);
  };

  return (
    <div>
      <ul>
        {todos.map((todoItem) => (
          <li key={todoItem.id} aria-label="todo-item">
            <div
              data-testid="todo-item-clickable"
              onClick={handleClickTodoItem(todoItem.id)}
              style={{ cursor: 'pointer' }}
            >
              {todoItem.done && <span aria-label="todo done"> 🥳 </span>}
              {todoItem.id === currentTodo && (
                <span aria-label="selected">✅</span>
              )}
              <span>{todoItem.title}</span>
              <span>{`${todoItem.sprintEnded} / ${todoItem.sprintTotal}`}</span>
              <button onClick={handleDelete(todoItem.id)}>delete</button>
              <button onClick={handleDone(todoItem.id)}>done</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
