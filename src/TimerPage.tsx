import React, { useState } from 'react';
import Timer, {
  TimerContainer,
  TimerProvider,
  TimerStartButton,
  TimerStopButton,
} from './Timer';
import Todo from './Todo';
import TodoFormProvider, {
  CancelFormButton,
  DecreaseSprintButton,
  EstimationSprintInput,
  IncreaseSprintButton,
  SaveFormButton,
  TitleField,
} from './TodoForm';
import type { TodoFormState } from 'types/todoform';
import type { TodoItem } from 'types/todo';
import './TodoForm.scss';
import useSWR from 'swr';

const SHORT_BREAK = 300;
const LONG_BREAK = 900;
const WORK_TIME = 1500;

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function TimerPage() {
  // replace get all todos
  //const [todos, setTodos] = useState<Array<TodoItem>>([]);
  const { data, error } = useSWR<Array<TodoItem>>(
    'http://localhost:3000/todos',
    fetcher,
    { refreshInterval: 1000 },
  );

  console.log('data: ', data, 'error: ', error);
  const todos = data || [];
  const [timer, setTimer] = useState<number>(WORK_TIME);
  const [breaking, setBreaking] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
  const [currentTodo, setCurrentTodo] = useState<number | null>(null);
  const [creatingNewTodo, setCreatingNewTodo] = useState<boolean>(false);

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
        fetch(`http://localhost:3000/todos/${currentTodo}`, {
          method: 'PATCH',
          body: JSON.stringify({
            sprintDone: todos[currentTodo].sprintDone + 1,
          }),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        });
        /*
        todos[currentTodo].sprintEnded += 1;
        // replace patch todo
        setTodos([...todos]);
        */
      }
    }
  };

  const submitNewTodo = (form: TodoFormState) => {
    if (form.title === '' || form.sprint <= 0) return false;
    // replace with post todo
    fetch(`http://localhost:3000/todos`, {
      method: 'POST',
      body: JSON.stringify({
        title: form.title,
        sprintTotal: form.sprint,
        sprintDone: 0,
        todoDone: false,
      }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
    /*
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
    */
    setCreatingNewTodo(false);
    return true;
  };

  const handleChangeCurrentTodo = (newTodo: number) => {
    setCurrentTodo(newTodo);
  };

  const handleDeleteTodo = (todoId: number) => {
    // replace with delete todo
    console.log('here');
    fetch(`http://localhost:3000/todos/${todoId}`, {
      method: 'DELETE',
    });
    /*
    setTodos((todos) => todos.filter((todo) => todo.id !== todoId));
    */
  };

  const handleDoneTodo = (todoId: number) => {
    // replace patch todo
    fetch(`http://localhost:3000/todos/${todoId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        todoDone: !todos[todoId].todoDone,
      }),
    });
    /*
    todos[todoId].done = !todos[todoId].done;
    setTodos([...todos]);
    */
  };

  const handleEditTodo = (todoId: number, form: TodoFormState) => {
    // replace patch todo
    fetch(`http://localhost:3000/todos/${todoId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: form.title,
        sprintTotal: form.sprint,
      }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
    /*
    todos[todoId] = {
      ...todos[todoId],
      title: form.title,
      sprintTotal: form.sprint,
    };
    setTodos([...todos]);
    */
  };

  const openNewTodoForm = () => {
    console.log('button clicked');
    setCreatingNewTodo(true);
  };

  const cancelCreateNewTodo = () => {
    setCreatingNewTodo(false);
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
      {creatingNewTodo ? (
        <TodoFormProvider
          onSubmit={submitNewTodo}
          onCancel={cancelCreateNewTodo}
        >
          <div className="form-container">
            <div className="form-container-inner">
              <TitleField />
              <div className="form-est-container">
                <span>How many sprint do you need?</span>
                <div className="form-est-container-inner">
                  <EstimationSprintInput />
                  <IncreaseSprintButton />
                  <DecreaseSprintButton />
                </div>
              </div>
            </div>
            <div className="form-submit-container">
              <CancelFormButton />
              <SaveFormButton />
            </div>
          </div>
        </TodoFormProvider>
      ) : (
        <button className="new-todo-btn" onClick={openNewTodoForm}>
          new todo
        </button>
      )}
    </div>
  );
}

export default TimerPage;
