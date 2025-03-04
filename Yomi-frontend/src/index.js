import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import AdminLogin from './components/admin/AdminLogin';

import Login from './components/Login';
import Register from './components/Register';
import Catalog from './components/Catalog';
import Collection from './components/Collection';
import Manga from './components/Manga';
import AddManga from './components/admin/AddManga';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Catalog/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
      <Route path="/catalog" element={<Catalog/>}></Route>
      <Route path="/collection" element={<Collection/>}></Route>
      <Route path="/catalog/:id" element={<Manga/>}></Route>
      <Route path="/admin" element={<AdminLogin/>}></Route>
      <Route path="/admin/add/" element={<AddManga/>}></Route>
      <Route path="/admin/add/:id" element={<AddManga/>}></Route>
    
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
