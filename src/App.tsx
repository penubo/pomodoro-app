import React from 'react';
import TimerPage from './TimerPage';
import './App.css';
import Todo from './Todo';

interface AppProps {}

function App({}: AppProps) {
  return (
    <div className="App">
      <TimerPage />
      <Todo todos={[{ id: 0, title: 'This is example of todo', sprint: 3 }]} />
    </div>
  );
}

export default App;
