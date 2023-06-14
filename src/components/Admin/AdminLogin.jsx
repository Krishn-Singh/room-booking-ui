import React, { useState } from 'react';
import { API_ROOT } from '../../api';
import AdminTable from './AdminTable';

const AdminLogin = () => {
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
        .then(response => response.json())
        .then(data => {
          // Check the response for success
          if (data.success) {
            // Login successful, you can store the user and token in your app's state or local storage
            const user = data.user;
            const token = data.token;

            localStorage.setItem("auth", token);
            console.log(token)

            console.log('Login successful:', user);

            if(user.role == '1'){
                setRedirectTo('/index');
                setLoginSuccess("login Succesful");
                } else {
                    setLoginSuccess("you are not admin")
                }
            
            
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
    return <AdminTable to={AdminTable} />;
  }


  return (
    <div className="container">
      <h1 className="mt-5 mb-4 text-center">Admin Login</h1>
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
      {loginSuccess ? (
        <div className="alert alert-success" role="alert">
          {loginSuccess}
        </div>
      ) : null}
    </div>
  );
};

export default AdminLogin;
