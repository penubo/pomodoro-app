import React from 'react';
import type { TodoList } from 'types/todo';

function Todo({
  todos = [],
  currentTodo = 0,
}: {
  todos: TodoList;
  onChangeCurrentTodo?: (newTodo: number) => void;
  currentTodo?: number | null;
}) {
  return (
    <div>
      <ul>
        {todos.map((todoItem) => (
          <li key={todoItem.id} aria-label="todo-item">
            {todoItem.id === currentTodo && (
              <span aria-label="selected">✅</span>
            )}
            <span>{todoItem.title}</span>
            <span>{`${todoItem.sprintEnded} / ${todoItem.sprintTotal}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
