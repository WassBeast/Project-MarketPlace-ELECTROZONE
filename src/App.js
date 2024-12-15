
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Layout from './components/Layout'; // Make sure this path is correct
import Signin from './pages/Signin'; 
import Signup from './pages/Signup'; 
import Profile from './pages/Profile'; 
import SearchResult from './pages/SearchResult';


// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap JS and Popper.js
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CreateProduct from './pages/CreateProduct'; // Ensure this import path is correct
import Laptop from './pages/Category/Laptop';
import Tv from './pages/Category/Tv';
import Climatiseur from './pages/Category/Climatiseur';
import Shopping from './pages/Shopping';
import Address from './pages/Address';
import Payment from './pages/Payment';
import Admin from "./pages/Admin";


function App() {

  const [searchText, setSearchText] = useState('');
  const [showSearchResult, setShowSearchResult] = useState(false);

  const handleSearchClick = (e) => {
    e.preventDefault();
    setShowSearchResult(true);
  };

  return (
    <Router>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/search/:searchQuery" element={<SearchResult />} /> 
        <Route path="/admin" element={<Admin />} />
        <Route path="/address" element={<Address />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/createproduct" element={<CreateProduct />} /> 
        <Route path="/climatiseur" element={<Climatiseur />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/laptop" element={<Laptop />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shopping" element={<Shopping />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
