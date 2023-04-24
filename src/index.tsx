import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';

const container = document.getElementById('root') as HTMLDivElement;
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
