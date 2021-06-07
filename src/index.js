import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider as OvermindProvider } from 'overmind-react';
import { overmind } from './overmind';


ReactDOM.render(
    <OvermindProvider value={overmind}>
        <App />
    </OvermindProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
