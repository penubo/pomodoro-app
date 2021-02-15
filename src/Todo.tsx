import React from 'react';

export type TodoItem = {
  id: number;
  title: string;
  sprint: number;
};

export type TodoList = Array<TodoItem>;

function Todo({ todos }: { todos: TodoList }) {
  return (
    <div>
      <ul>
        {todos.map((todoItem) => (
          <li key={todoItem.id} aria-label="todo item">
            <span>{todoItem.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
