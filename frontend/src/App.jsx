import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Articles from './pages/Articles';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import SinglePost from './pages/SinglePost';
import UserProfile from './pages/UserProfile';
import SearchResults from './pages/SearchResults';
import About from './pages/About';
import Contact from './pages/Contact';
import WritePost from './pages/WritePost';
import EditPost from './pages/EditPost';

function App() {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);


  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header user={user} setUser={setUser} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<SinglePost user={user} />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/create-post" element={<WritePost user={user} />} />
<Route path="/search" element={<SearchResults />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/edit-post/:slug" element={<EditPost user={user} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;