import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import LoginPage from './components/login'
// import FaceScanRequirements from './components/otp'
import App from './App'
// import Login from './components/Loginpage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <LoginPage/> */}
    {/* <FaceScanRequirements/> */} 
    <App/>
    {/* <Login/> */}
  </StrictMode>,
)
