import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Formbuilder from './Formbuilder'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Formbuilder/>
  </StrictMode>,
)
