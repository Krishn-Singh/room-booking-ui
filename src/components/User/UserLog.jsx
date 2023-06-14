import React, { useState } from 'react'
import { API_ROOT } from '../../api';
import RoomDetail from '../RoomDetail/RoomDetail';

const UserLogged = () => {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestBody = {
        email: email,
        password: password
      };
      fetch(`${API_ROOT}auth/login`, {
        method: 'POST',
        headers: {
          authorization: localStorage.getItem('auth'),
          'content-type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
        .then(response => response.json())
        .then(data => {
          // Check the response for success
          if (data.success) {
            // Login successful, you can store the user and token in your app's state or local storage
            const userId = data.user._id;

            localStorage.setItem("userId", userId);
            console.log('Login successful:', data.user);
            setLoginSuccess(true);
  
            setLoginSuccess(true);

            setRedirectTo('/index');
  
            // TODO: Redirect to the desired page or perform additional actions
          } else {
            // Login failed, handle the error
            const message = data.message;
            console.log('Login failed:', message);
  
            // TODO: Display an error message to the user
          }
        }).catch(error => {
            // Handle any network or API errors
            console.log('An error occurred:', error);
    
            // TODO: Display an error message to the user
          });  
  };

  if (redirectTo) {
    return <RoomDetail to={RoomDetail}/>;
  }
  return (
    <div className="container">
      <h1 className="mt-5 mb-4 text-center">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Login
        </button>
        </form>
        </div>
  )
}

export default UserLogged