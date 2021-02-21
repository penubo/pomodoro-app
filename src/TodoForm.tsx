import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createContext, Dispatch, useContext, useReducer } from 'react';

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

const TodoFormContext = createContext<TodoFormContextValue | null>(null);

function formReducer(state: TodoFormState, action: TodoFormAction) {
  switch (action.type) {
    case 'decrease-sprint':
      return { ...state, sprint: state.sprint - 1 };
    case 'increase-sprint':
      return { ...state, sprint: state.sprint + 1 };
    case 'new-sprint':
      return { ...state, sprint: action.sprint };
    case 'edit-title':
      return { ...state, title: action.newTitle };
    default:
      throw new Error('no action type found in formReducer');
  }
}

function TodoFormProvider({
  children,
  initialForm = { title: '', sprint: 1 },
  onSubmit,
}: {
  children: React.ReactNode;
  initialForm: TodoFormState;
  onSubmit: (form: TodoFormState) => boolean;
}) {
  const [form, dispatch] = useReducer(formReducer, initialForm);
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSubmit(form);
  };
  return (
    <TodoFormContext.Provider value={{ form, dispatch }}>
      <form onSubmit={handleSubmit}>{children}</form>
    </TodoFormContext.Provider>
  );
}

function useTodoForm() {
  const context = useContext(TodoFormContext);
  if (context === null) {
    throw new Error('useTodoForm should be used inside TodoFormProvider');
  }
  return context;
}

function NewFormButton() {
  return <button type="submit">new</button>;
}

function TitleField() {
  return <input id="todo-title" aria-label="title for new todo" name="title" />;
}

function EstimationSprintInput() {
  const {
    form: { sprint },
    dispatch,
  } = useTodoForm();
  const handleSprintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSprint = Number(e.target.value);
    dispatch({ type: 'new-sprint', sprint: newSprint });
  };
  return (
    <input
      id="todo-sprint"
      aria-label="amount of sprint for new todo"
      name="sprint"
      type="number"
      step={1}
      value={sprint}
      onChange={handleSprintChange}
    />
  );
}

function IncreaseSprintButton() {
  const { dispatch } = useTodoForm();
  const handleSprintUp = () => {
    dispatch({ type: 'increase-sprint' });
  };
  return (
    <button
      id="sprint-up"
      aria-label="increase sprint"
      onClick={handleSprintUp}
    >
      <FontAwesomeIcon icon={faCaretUp} />
    </button>
  );
}

function DecreaseSprintButton() {
  const { dispatch } = useTodoForm();
  const handleSprintDown = () => {
    dispatch({ type: 'decrease-sprint' });
  };
  return (
    <button
      id="sprint-down"
      aria-label="decrease sprint"
      onClick={handleSprintDown}
    >
      <FontAwesomeIcon icon={faCaretDown} />
    </button>
  );
}

export default TodoFormProvider;
export {
  useTodoForm,
  NewFormButton,
  TitleField,
  EstimationSprintInput,
  IncreaseSprintButton,
  DecreaseSprintButton,
};
