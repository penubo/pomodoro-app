import type { Dispatch, SyntheticEvent } from 'react';

type TodoFormState = {
  title: string;
  sprint: number;
};

type TodoFormAction =
  | { type: 'increase-sprint' }
  | { type: 'decrease-sprint' }
  | { type: 'new-sprint'; sprint: number }
  | { type: 'edit-title'; newTitle: string }
  | { type: 'reset' };

type TodoFormContextValue = {
  form: TodoFormState;
  dispatch: Dispatch<TodoFormAction>;
  cancelForm: (e: SyntheticEvent) => void;
};

export { TodoFormState, TodoFormAction, TodoFormContextValue };
