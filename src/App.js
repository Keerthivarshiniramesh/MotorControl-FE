
import { Route, Router, Routes } from 'react-router-dom';
import './App.css'

import Logins from './components/Logins';
import Register from './components/Register';
import ControlSystem from './components/ControlSystem';

function App() {




  return (

    <Routes>
      <Route path='/' element={<Logins />} />
      <Route path='/register' element={<Register />} />
      <Route path='/home' element={<ControlSystem />} />
    </Routes>

  )
}

export default App;
