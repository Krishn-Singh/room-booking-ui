import React, { useState } from 'react'
import { API_ROOT } from '../../api';


const UserRegister = () => {
    const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleSubmit =  async (e) => {
    e.preventDefault();
    try {
      // Prepare the data to send in the request body
      const data = {
        firstName,
        lastName,
        email,
        password,
      };

      // Make the API request
      const response = await fetch(`${API_ROOT}auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        // Registration successful, handle the response
        const responseData = await response.json();
        console.log('Registration successful:', responseData);
        setRegistrationStatus('success');
      } else {
        // Registration failed, handle the error
        console.error('Registration failed:', response.status, response.statusText);
        setRegistrationStatus('error');
      }
    } catch (error) {
      console.error('Error occurred during registration:', error);
      setRegistrationStatus('error');
    }
  };

  return (
        <div className="container">
      <h1 className="mt-5 mb-4 text-center">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div><div className="form-group">
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
          Sign Up
        </button>
      </form>
      {registrationStatus === 'success' && (
        <div className="alert alert-success" role="alert">
          Registration successful! Your account has been created.
        </div>
      )}
      {registrationStatus === 'error' && (
        <div className="alert alert-danger" role="alert">
          Registration failed. Please try again.
        </div>
      )}
    </div>
  );
};


export default UserRegister