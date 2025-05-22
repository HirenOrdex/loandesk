import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import store from './redux/store.ts'
import { Provider } from 'react-redux'
import storePersistor from './redux/storePersistor.ts'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate persistor={storePersistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider >
)
