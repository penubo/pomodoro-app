import React from 'react';
import TimerPage from './TimerPage';
import './App.css';

interface AppProps {}

function App({}: AppProps) {
  return (
    <div className="App">
      <TimerPage />
      <span>hello world </span>
    </div>
  );
}

export default App;
