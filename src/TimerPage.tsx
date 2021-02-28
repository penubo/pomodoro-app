import React, { useState } from 'react';
import Timer, {
  TimerContainer,
  TimerProvider,
  TimerStartButton,
  TimerStopButton,
} from './Timer';
import Todo from './Todo';
import TodoFormProvider, {
  DecreaseSprintButton,
  EstimationSprintInput,
  IncreaseSprintButton,
  NewFormButton,
  TitleField,
} from './TodoForm';
import type { TodoFormState } from 'types/todoform';
import type { TodoItem } from 'types/todo';

const SHORT_BREAK = 300;
const LONG_BREAK = 900;
const WORK_TIME = 1500;
function TimerPage() {
  const [todos, setTodos] = useState<Array<TodoItem>>([]);
  const [timer, setTimer] = useState<number>(WORK_TIME);
  const [breaking, setBreaking] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
  const [currentTodo, setCurrentTodo] = useState<number | null>(null);

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

      if (currentTodo !== null) {
        todos[currentTodo].sprintEnded += 1;
        setTodos([...todos]);
      }
    }
  };

  const submitNewTodo = (form: TodoFormState) => {
    if (form.title === '' || form.sprint <= 0) return false;
    setTodos([
      ...todos,
      {
        id: todos.length,
        title: form.title,
        sprintTotal: form.sprint,
        sprintEnded: 0,
        done: false,
      },
    ]);
    return true;
  };

  const handleChangeCurrentTodo = (newTodo: number) => {
    setCurrentTodo(newTodo);
  };

  const handleDeleteTodo = (todoId: number) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== todoId));
  };

  const handleDoneTodo = (todoId: number) => {
    todos[todoId].done = !todos[todoId].done;
    setTodos([...todos]);
  };

  const handleEditTodo = (todoId: number, form: TodoFormState) => {
    todos[todoId] = {
      ...todos[todoId],
      title: form.title,
      sprintTotal: form.sprint,
    };
    setTodos([...todos]);
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
      <Todo
        todos={todos}
        currentTodo={currentTodo}
        onChangeCurrentTodo={handleChangeCurrentTodo}
        onDeleteTodo={handleDeleteTodo}
        onDoneTodo={handleDoneTodo}
        onEditTodo={handleEditTodo}
      />
      <TodoFormProvider onSubmit={submitNewTodo}>
        <TitleField />
        <EstimationSprintInput />
        <IncreaseSprintButton />
        <DecreaseSprintButton />
        <NewFormButton />
      </TodoFormProvider>
    </div>
  );
}

export default TimerPage;
