import {faCaretDown, faCaretUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {createContext, useContext, useReducer} from 'react';
import type {
  TodoFormAction,
  TodoFormContextValue,
  TodoFormState,
} from 'types/todoform';
import './TodoForm.scss';

const TodoFormContext = createContext<TodoFormContextValue | null>(null);

function formReducer(state: TodoFormState, action: TodoFormAction) {
  switch (action.type) {
    case 'decrease-sprint':
      return {...state, sprint: state.sprint - 1};
    case 'increase-sprint':
      return {...state, sprint: state.sprint + 1};
    case 'new-sprint':
      return {...state, sprint: action.sprint};
    case 'edit-title':
      return {...state, title: action.newTitle};
    case 'reset':
      return {title: '', sprint: 0};
    default:
      throw new Error('no action type found in formReducer');
  }
}

function TodoFormProvider({
  children,
  initialForm = {title: '', sprint: 0},
  onSubmit,
  onCancel,
}: {
  children: React.ReactNode;
  initialForm?: TodoFormState;
  onSubmit: (form: TodoFormState) => Promise<boolean>;
  onCancel?: () => void;
}) {
  const [form, dispatch] = useReducer(formReducer, initialForm);
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSubmit(form);
    dispatch({type: 'reset'});
  };
  const cancelForm = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (onCancel) onCancel();
    dispatch({type: 'reset'});
  };
  return (
    <TodoFormContext.Provider value={{form, dispatch, cancelForm}}>
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

function SaveFormButton() {
  return (
    <button className="form-submit-btn" type="submit">
      save
    </button>
  );
}

function CancelFormButton() {
  const {cancelForm} = useTodoForm();
  return (
    <button className="form-submit-btn" type="button" onClick={cancelForm}>
      cancel
    </button>
  );
}

function TitleField() {
  const {
    form: {title},
    dispatch,
  } = useTodoForm();
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newTitle = e.target.value;
    dispatch({type: 'edit-title', newTitle});
  };
  return (
    <input
      className="form-title"
      id="todo-title"
      aria-label="title for new todo"
      placeholder="what will you do?"
      name="title"
      value={title}
      onChange={handleTitleChange}
    />
  );
}

function EstimationSprintInput() {
  const {
    form: {sprint},
    dispatch,
  } = useTodoForm();
  const handleSprintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSprint = Number(e.target.value);
    dispatch({type: 'new-sprint', sprint: newSprint});
  };
  return (
    <input
      id="todo-sprint"
      className="form-sprint"
      aria-label="amount of sprint for new todo"
      name="sprint"
      type="number"
      step={1}
      min={0}
      value={sprint}
      onChange={handleSprintChange}
    />
  );
}

function IncreaseSprintButton() {
  const {dispatch} = useTodoForm();
  const handleSprintUp = () => {
    dispatch({type: 'increase-sprint'});
  };
  return (
    <button
      id="sprint-up"
      aria-label="increase sprint"
      type="button"
      onClick={handleSprintUp}
    >
      <FontAwesomeIcon icon={faCaretUp} />
    </button>
  );
}

function DecreaseSprintButton() {
  const {
    form: {sprint},
    dispatch,
  } = useTodoForm();
  const handleSprintDown = () => {
    if (sprint > 0) dispatch({type: 'decrease-sprint'});
  };
  return (
    <button
      id="sprint-down"
      aria-label="decrease sprint"
      type="button"
      onClick={handleSprintDown}
    >
      <FontAwesomeIcon icon={faCaretDown} />
    </button>
  );
}

export default TodoFormProvider;
export {
  useTodoForm,
  SaveFormButton,
  TitleField,
  EstimationSprintInput,
  IncreaseSprintButton,
  DecreaseSprintButton,
  CancelFormButton,
};
