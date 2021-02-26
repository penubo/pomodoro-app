import React from 'react';
import type { TodoList } from 'types/todo';

function Todo({
  todos = [],
  onChangeCurrentTodo,
  onDeleteTodo,
  currentTodo = 0,
}: {
  todos: TodoList;
  onChangeCurrentTodo?: (newTodo: number) => void;
  onDeleteTodo?: (todo: number) => void;
  currentTodo?: number | null;
}) {
  const handleClickTodoItem = (newTodo: number) => () => {
    if (onChangeCurrentTodo) onChangeCurrentTodo(newTodo);
  };

  const handleDelete = (todoId: number) => () => {
    if (onDeleteTodo) onDeleteTodo(todoId);
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
              {todoItem.id === currentTodo && (
                <span aria-label="selected">✅</span>
              )}
              <span>{todoItem.title}</span>
              <span>{`${todoItem.sprintEnded} / ${todoItem.sprintTotal}`}</span>
              <button onClick={handleDelete(todoItem.id)}>delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
