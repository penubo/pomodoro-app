import React from 'react';
import type { TodoList } from 'types/todo';

function Todo({ todos = [] }: { todos: TodoList }) {
  return (
    <div>
      <ul>
        {todos.map((todoItem) => (
          <li key={todoItem.id} aria-label="todo-item">
            <span>{todoItem.title}</span>
            <span>{todoItem.sprintTotal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
