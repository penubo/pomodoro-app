import type { Dispatch } from 'react';

type TodoFormState = {
  title: string;
  sprint: number;
};

type TodoFormAction =
  | { type: 'increase-sprint' }
  | { type: 'decrease-sprint' }
  | { type: 'new-sprint'; sprint: number }
  | { type: 'edit-title'; newTitle: string };

type TodoFormContextValue = {
  form: TodoFormState;
  dispatch: Dispatch<TodoFormAction>;
};

export { TodoFormState, TodoFormAction, TodoFormContextValue };
