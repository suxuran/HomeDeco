import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css'; // Make sure this matches your css filename

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}