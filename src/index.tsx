import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Inicia a conexão da nossa aplicação com o firebase
import './services/firebase';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
