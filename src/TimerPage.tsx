import React, { useState } from 'react';
import Timer, {
  TimerProvider,
  TimerStartButton,
  TimerStopButton,
} from './Timer';
import Todo from './Todo';

function TimerPage() {
  const [sprintSelection, setSprintSelection] = useState<number>(0);
  const handleSprintUp = () => {
    setSprintSelection((s) => s + 1);
  };
  const handleSprintDown = () => {
    setSprintSelection((s) => s - 1);
  };
  const createNewTodo = () => {
    // TODO: Create new todo
  };
  return (
    <div>
      <TimerProvider>
        <Timer initialTime={1500} />
        <TimerStartButton />
        <TimerStopButton />
      </TimerProvider>
      <Todo todos={[{ id: 0, title: 'This is example of todo', sprint: 3 }]} />
      <button onClick={createNewTodo}>new</button>
      <label htmlFor="todo-title">todo-title</label>
      <input id="todo-title" />
      <span aria-label="sprint-selection">{sprintSelection}</span>
      <button onClick={handleSprintUp}> sprint-set-up </button>
      <button onClick={handleSprintDown}> sprint-set-down </button>
    </div>
  );
}

export default TimerPage;
