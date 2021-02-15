import React from 'react';

type TodoItem = {
  id: number;
  title: string;
  sprint: number;
};

type TodoList = Array<TodoItem>;

function Todo({ todos }: { todos: TodoList }) {
  return (
    <div>
      <ul>
        {todos.map((todoItem) => (
          <li key={todoItem.id} aria-label="todo item">
            {todoItem.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
