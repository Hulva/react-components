import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ThemedButton from './components/theme/themed-button';
import { themes, ThemeContext } from './components/theme/theme-context';

function App() {
  const [theme, setTheme] = useState('light');
  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <ThemeContext.Provider value={{theme: themes.get(theme), changeTheme: toggleTheme}}>
        <ThemedButton />
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
