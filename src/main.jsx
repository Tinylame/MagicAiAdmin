import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@store/store';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
      <Provider store={store}>
        <PersistGate loading={<div>正在加载...</div>} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
)
