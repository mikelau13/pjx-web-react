import './register.css';
import axios from 'axios';
import React, { FunctionComponent, useState } from "react";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IDENTITY_CONFIG } from '../../utils/authConst';

interface RegisterProps {
  updateTitle: any
  showError: any
}

const Register: FunctionComponent<RegisterProps & RouteComponentProps> = props => {
    const [state , setState] = useState({
      email : '',
      password : '',
      confirmPassword: '',
      successMessage: ''
    });

    const handleChange = (e:any) => {
      const { id, value } = e.target;

      setState(prevState => ({
        ...prevState,
        [id]: value
      }));
    };

    const redirectToLogin = () => {
      props.updateTitle('Login')
      props.history.push('/login'); 
  }

    const redirectToHome = () => {
      props.updateTitle('Home')
      props.history.push('/home');
    }

    const sendDetailsToServer = () => {
      if(state.email.length && state.password.length) {
          props.showError(null);

          var qs = require('qs');
          const payload = qs.stringify({
              Email: state.email,
              Password: state.password,
          });
          const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
          };

          axios.post(IDENTITY_CONFIG.registration_url, payload, { headers, validateStatus: (status) => { return (status >= 200 && status < 300) || status === 400; } })
              .then(function (response) {
                  if(response.data.code === 200){
                      setState(prevState => ({
                          ...prevState,
                          successMessage : 'Registration successful. Redirecting to home page..'
                      }))
                      redirectToHome();
                      props.showError(null)
                  } else {
                    console.log(response);
                    if(response.data.PasswordRequiresLower) {
                      props.showError(response.data.PasswordRequiresLower[0]);
                    }
                    if(response.data.PasswordRequiresNonAlphanumeric) {
                      props.showError(response.data.PasswordRequiresNonAlphanumeric[0]);
                    }
                    if(response.data.PasswordRequiresUpper) {
                      props.showError(response.data.PasswordRequiresUpper[0]);
                    }
                    if(response.data.PasswordTooShort) {
                      props.showError(response.data.PasswordTooShort[0]);
                    }
                    if(response.data.PasswordRequiresDigit) {
                      props.showError(response.data.PasswordRequiresDigit[0]);
                    }
                    if(response.data.DuplicateUserName) {
                      props.showError(response.data.DuplicateUserName[0]);
                    }
                    if(response.data.Email) {
                      props.showError(response.data.Email[0]);
                    }
                  }
              })
              .catch(function (error) {
                  console.log(error);
                  props.showError('Unexpected Error')
              });    
      } else {
        props.showError('Please enter valid username and password')    
      }      
  }

    const handleSubmit = (e:any) => {
      e.preventDefault();

      if (state.password === state.confirmPassword) {
        sendDetailsToServer();
      } else {
        props.showError('Passwords do not match');
      }
    };

    return (
      <div className="register">
            <form>
                <div>
                <label>Email address</label>
                <input type="email" 
                       id="email" 
                       placeholder="Enter email"
                       value={state.email}
                       onChange={handleChange}
                />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" 
                        id="password" 
                        placeholder="Password"
                        value={state.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" 
                        id="confirmPassword" 
                        placeholder="Confirm Password"
                        value={state.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <button 
                    type="submit" 
                    onClick={handleSubmit}
                >
                    Register
                </button>
            </form>
            <div style={{display: state.successMessage ? 'block' : 'none' }}>
                {state.successMessage}
            </div>
            <div>
                <span>Already have an account? </span>
                <span onClick={() => redirectToLogin()}>Login here</span> 
            </div>
        </div>
    );
};

export default withRouter(Register);
