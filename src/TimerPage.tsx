import React, { useState } from 'react';
import Timer, {
  TimerContainer,
  TimerProvider,
  TimerStartButton,
  TimerStopButton,
} from './Timer';
import Todo, { TodoItem } from './Todo';
import TodoFormProvider, {
  DecreaseSprintButton,
  EstimationSprintInput,
  IncreaseSprintButton,
  NewFormButton,
  TitleField,
} from './TodoForm';
import type { TodoFormState } from 'types/todoform';

const SHORT_BREAK = 300;
const LONG_BREAK = 900;
const WORK_TIME = 1500;
function TimerPage() {
  const [todos, setTodos] = useState<Array<TodoItem>>([]);
  const [timer, setTimer] = useState<number>(WORK_TIME);
  const [breaking, setBreaking] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);

  const handleTimerEnd = () => {
    if (breaking) {
      setTimer(1500);
      setBreaking(false);
    } else {
      if (round % 4 === 0) {
        setTimer(LONG_BREAK);
      } else {
        setTimer(SHORT_BREAK);
      }
      setBreaking(true);
      setRound((r) => r + 1);
    }
  };

  const submitNewTodo = (form: TodoFormState) => {
    if (form.title === '' || form.sprint <= 0) return false;
    setTodos([
      ...todos,
      { id: todos.length, title: form.title, sprint: form.sprint },
    ]);
    return true;
  };
  return (
    <div>
      <TimerProvider>
        <TimerContainer>
          <Timer key={timer} initialTime={timer} onTimeEnd={handleTimerEnd} />
          <TimerStartButton style={{ margin: '1rem' }} />
          <TimerStopButton style={{ margin: '1rem' }} />
        </TimerContainer>
      </TimerProvider>
      <Todo todos={todos} />
      <TodoFormProvider onSubmit={submitNewTodo}>
        <NewFormButton />
        <TitleField />
        <EstimationSprintInput />
        <IncreaseSprintButton />
        <DecreaseSprintButton />
      </TodoFormProvider>
    </div>
  );
}

export default TimerPage;
