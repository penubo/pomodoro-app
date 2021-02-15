import React from 'react';
import TimerPage from './TimerPage';
import './App.css';
import Todo from './Todo';

interface AppProps {}

function App({}: AppProps) {
  return (
    <div className="App">
      <TimerPage />
      <Todo />
    </div>
  );
}

export default App;
