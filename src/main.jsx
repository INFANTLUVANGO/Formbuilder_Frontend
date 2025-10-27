import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Formbuilder from './Formbuilder'
import Auth from "./Components/Auth/Auth"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Formbuilder/>
  </StrictMode>,
)
