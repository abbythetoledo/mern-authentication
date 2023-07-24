import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, 
        createRoutesFromElements, 
        Route, 
        RouterProvider } from 'react-router-dom';

import store from './store.js'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import HomeScreen from './views/HomeScreen .jsx'
import LogInScreen from './views/LogInScreen.jsx'
import RegisterScreen from './views/RegisterScreen.jsx'
import { Provider } from 'react-redux';
import ProfileScreen from './views/ProfileScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Welcome from './views/Welcome.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index={ true } path='/' element={<HomeScreen />}/>
      <Route path='/login' element={ <LogInScreen /> } />
      <Route path='/register' element={ <RegisterScreen /> } />
      <Route path='' element={ <PrivateRoute />} >
        <Route path='/profile' element={ <ProfileScreen />} />
      </Route>
      <Route path='/confirm/:confirmationCode' Component={Welcome} />      
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={ store }>
    <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  </Provider>
  
)
