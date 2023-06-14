
import './App.css';
import {Routes,Route} from 'react-router-dom'

import Nav from './components/Navbar/Nav';
import UserLogged from './components/User/UserLog';
import AdminLogin from './components/Admin/AdminLogin';
import UserRegister from './components/User/UserRegister';


function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
      <Route exact path="/" element={<h1>Book Your Rooms !! Sign up</h1>} />
        <Route path="/userlogin" element={<UserLogged />} />
        <Route path="/Adminlogin" element={<AdminLogin />} />
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="*" element={<h1>No page found</h1>} />
        
      </Routes>
    </div>
  );
}

export default App;
