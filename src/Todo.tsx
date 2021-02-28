import React, { useState } from 'react';
import './Todo.scss';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { TodoList } from 'types/todo';
import TodoFormProvider, {
  DecreaseSprintButton,
  EstimationSprintInput,
  IncreaseSprintButton,
  NewFormButton,
  TitleField,
} from './TodoForm';

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
  const [editingTodo, setEditingTodo] = useState<number | null>(null);
  const handleClickTodoItem = (newTodo: number) => () => {
    if (onChangeCurrentTodo) onChangeCurrentTodo(newTodo);
  };

  const handleDelete = (todoId: number) => () => {
    if (onDeleteTodo) onDeleteTodo(todoId);
  };

  const handleDone = (todoId: number) => (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    e.stopPropagation();
    if (onDoneTodo) onDoneTodo(todoId);
  };

  const handleEditTodo = (todoId: number) => (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    setEditingTodo(todoId);
  };

  return (
    <div>
      <ul className="todo-list">
        {todos.map((todoItem) => (
          <React.Fragment key={todoItem.id}>
            <li aria-label="todo-item">
              <div
                className="todo-item-outerbox"
                data-testid="todo-item-clickable"
                onClick={handleClickTodoItem(todoItem.id)}
              >
                <div className="todo-item-innerbox">
                  <div
                    aria-label="todo finish switch"
                    onClick={handleDone(todoItem.id)}
                    className="todo-done-box"
                  >
                    {todoItem.done ? (
                      <span aria-label="todo done">🥳</span>
                    ) : (
                      <span aria-label="todo not done">👨‍💻</span>
                    )}
                  </div>
                  <div className="todo-selected-box">
                    {todoItem.id === currentTodo ? (
                      <span aria-label="selected">🔥</span>
                    ) : (
                      <span aria-label="not selected">🌸</span>
                    )}
                  </div>
                  <span>{todoItem.title}</span>
                </div>
                <span className="todo-item-sprint">{`${todoItem.sprintEnded} / ${todoItem.sprintTotal}`}</span>
                <button aria-label="delete" onClick={handleDelete(todoItem.id)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                <button onClick={handleEditTodo(todoItem.id)}>edit</button>
              </div>
            </li>
            {todoItem.id === editingTodo && (
              <TodoFormProvider
                initialForm={{
                  title: todoItem.title,
                  sprint: todoItem.sprintTotal,
                }}
                onSubmit={() => true}
              >
                <TitleField />
                <EstimationSprintInput />
                <IncreaseSprintButton />
                <DecreaseSprintButton />
                <NewFormButton />
              </TodoFormProvider>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
