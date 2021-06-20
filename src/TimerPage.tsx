import React, {useState} from 'react';
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
import type {TodoFormState} from 'types/todoform';
import type {TodoItem} from 'types/todo';
import './TodoForm.scss';
import axios from 'axios';
import useSWR from 'swr';

const SHORT_BREAK = 300;
const LONG_BREAK = 900;
const WORK_TIME = 2;

//@ts-ignore
const fetcher = (url) => axios.get(url).then(res => res.data);

function TimerPage() {
  // replace get all todos
  //const [todos, setTodos] = useState<Array<TodoItem>>([]);
  const {data, error} = useSWR<Array<TodoItem>>(
    'http://localhost:3000/todos',
    fetcher,
    {refreshInterval: 1000},
  );

  const todos = data || [];
  const todosMap: Map<number, TodoItem> = new Map(todos.map(i => [i.id, i]));
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

      if (currentTodo !== null && todosMap.has(currentTodo)) {
        const body = {sprintDone: todosMap.get(currentTodo)!.sprintDone + 1}
        const headers = {
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }

        axios.patch(`http://localhost:3000/todos/${currentTodo}`,
          body,
          headers
        );
      }
    }
  };

  const submitNewTodo = (form: TodoFormState) => {
    if (form.title === '' || form.sprint <= 0) return false;
    // replace with post todo

    const body = {
      title: form.title,
      sprintTotal: form.sprint,
      sprintDone: 0,
      todoDone: false,
    }
    const headers = {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }

    axios.post(`http://localhost:3000/todos`,
      body,
      headers
    );

    setCreatingNewTodo(false);

    return true;
  };

  const handleChangeCurrentTodo = (newTodo: number) => {
    setCurrentTodo(newTodo);
  };

  const handleDeleteTodo = (todoId: number) => {
    // replace with delete todo
    axios.delete(`http://localhost:3000/todos/${todoId}`);
  };

  const handleDoneTodo = (todoId: number) => {
    // replace patch todo
    if (!todosMap.has(todoId))
      throw new Error("todo does not exist error");

    const body = {
      todoDone: !(todosMap.get(todoId)!.todoDone),
    }
    axios.patch(`http://localhost:3000/todos/${todoId}`,
      body
    );
  };

  const handleEditTodo = (todoId: number, form: TodoFormState) => {
    // replace patch todo
    const body = {
      title: form.title,
      sprintTotal: form.sprint,
    }
    const headers = {
      headers: {'Content-Type': 'application/json; charset=UTF-8', }
    }
    axios.patch(`http://localhost:3000/todos/${todoId}`,
      body,
      headers
    );
  };

  const openNewTodoForm = () => {
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
          <TimerStartButton style={{margin: '1rem'}} />
          <TimerStopButton style={{margin: '1rem'}} />
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
