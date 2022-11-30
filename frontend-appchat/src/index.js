import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Homepage from './components/homepages/homepage';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Register from './components/register/register';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter basename='/'>
        <Routes>
            <Route path='/' exact element={<Homepage/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
        </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
