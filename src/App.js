import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Form from './pages/Form';

const App = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/incident/:id" element={<Detail />} />
            <Route path="/add" element={<Form />} />
            <Route path="/edit/:id" element={<Form />} />
        </Routes>
    </Router>
  );
};

export default App;
