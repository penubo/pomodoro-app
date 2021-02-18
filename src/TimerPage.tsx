import React, { FormEvent, useState } from 'react';
import Timer, {
  TimerProvider,
  TimerStartButton,
  TimerStopButton,
} from './Timer';
import Todo, { TodoItem } from './Todo';

function TimerPage() {
  const [sprintSelection, setSprintSelection] = useState<number>(0);
  const [todos, setTodos] = useState<Array<TodoItem>>([]);
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
    // TODO: Create new todo
  };
  return (
    <div>
      <TimerProvider>
        <Timer initialTime={1500} />
        <TimerStartButton />
        <TimerStopButton />
      </TimerProvider>
      <Todo todos={todos} />
      <form onSubmit={createNewTodo}>
        <button type="submit">new</button>
        <label htmlFor="todo-title">todo-title</label>
        <input id="todo-title" name="title" />
        <label htmlFor="todo-sprint">todo-sprint</label>
        <input
          id="todo-sprint"
          name="sprint"
          type="number"
          step={1}
          value={sprintSelection}
          onChange={handleSprintChange}
        />
        <button onClick={handleSprintUp}> sprint-set-up </button>
        <button onClick={handleSprintDown}> sprint-set-down </button>
      </form>
    </div>
  );
}

export default TimerPage;
