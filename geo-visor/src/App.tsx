// src/App.tsx

import React from 'react';
import MapComponent from './components/Map/MapComponent';
import './App.css';
import './styles/rrhStyles.css';

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <header className="App-header">
        <h1>Visor Geográfico</h1>
      </header> */}
      <MapComponent />
    </div>
  );
};

export default App;
