import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import DataProvider from './DataContext';
import Destruccture from './Destruccture';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <DataProvider value={{message:"Good morning"}}>
      <App />
      <Destruccture />
    </DataProvider>
  </>
);

