import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Provider } from './components/ui/provider.tsx';
import App from './App.tsx'
import './index.css'

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
)
