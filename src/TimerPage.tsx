import React, { useState } from 'react';
import Timer, {
  TimerContainer,
  TimerProvider,
  TimerStartButton,
  TimerStopButton,
} from './Timer';
import Todo, { TodoItem } from './Todo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const SHORT_BREAK = 300;
const LONG_BREAK = 900;
const WORK_TIME = 1500;
function TimerPage() {
  const [sprintSelection, setSprintSelection] = useState<number>(0);
  const [todos, setTodos] = useState<Array<TodoItem>>([]);
  const [timer, setTimer] = useState<number>(WORK_TIME);
  const [breaking, setBreaking] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);

  const handleSprintUp = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setSprintSelection((s) => s + 1);
  };
  const handleSprintDown = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setSprintSelection((s) => s - 1);
  };
  const handleSprintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSprintSelection(Number(e.target.value));
  };
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
  const createNewTodo = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { title, sprint } = e.target as typeof e.target & {
      title: { value: string };
      sprint: { value: number };
    };
    setTodos([
      ...todos,
      { id: todos.length, title: title.value, sprint: sprint.value },
    ]);
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
      <form onSubmit={createNewTodo}>
        <button type="submit">new</button>
        <input id="todo-title" aria-label="title for new todo" name="title" />
        <input
          id="todo-sprint"
          aria-label="amount of sprint for new todo"
          name="sprint"
          type="number"
          step={1}
          value={sprintSelection}
          onChange={handleSprintChange}
        />
        <button
          id="sprint-up"
          aria-label="increase sprint"
          onClick={handleSprintUp}
        >
          <FontAwesomeIcon icon={faCaretUp} />
        </button>
        <button
          id="sprint-down"
          aria-label="decrease sprint"
          onClick={handleSprintDown}
        >
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
      </form>
    </div>
  );
}

export default TimerPage;
