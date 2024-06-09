import React, { useState, useEffect } from 'react';
import './App.css';
import RainAnimation from './components/RainAnimation';
import ClearAnimation from './components/ClearAnimation';
import ThunderstormAnimation from './components/ThunderstormAnimation';
import HazeMistAnimation from './components/HazeMistAnimation';
import SnowAnimation from './components/SnowAnimation';
import NightAnimation from './components/NightAnimation';

const components = [
  RainAnimation,
  ClearAnimation,
  ThunderstormAnimation,
  HazeMistAnimation,
  SnowAnimation,
  NightAnimation
];

function App() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % components.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const Component = components[index];
  return (
    <div className="App">
        <Component />
    </div>
  );
}

export default App;