import './register.css';
import axios from 'axios';
import React, { FunctionComponent, useState } from "react";
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { IDENTITY_CONFIG } from '../../utils/authConst';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


const styles = (theme: Theme) =>
  createStyles({
    textField: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    }
  });


interface RegisterProps {
  updateTitle: any
  showError: any
}


const Register: FunctionComponent<RegisterProps & RouteComponentProps & WithStyles<typeof styles>> = props => {
    const { classes } = props;

    const [state , setState] = useState({
      email : '',
      password : '',
      confirmPassword: ''
    });

    const [submissionState, setSubmission] = useState({isSubmitting: false, isSubmissionComplete: false});

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
                  if(response.status === 200){
                      setState(prevState => ({
                          ...prevState,
                          successMessage : 'Registration successful. Redirecting to home page..'
                      }));
                      //redirectToHome();
                      props.showError(null);
                      setSubmission({isSubmitting: false, isSubmissionComplete: true});
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
                    setSubmission({isSubmitting: false, isSubmissionComplete: false});
                  }
              })
              .catch(function (error) {
                  console.log(error);
                  props.showError('Unexpected Error');
                  setSubmission({isSubmitting: false, isSubmissionComplete: false});
              });    
      } else {
        props.showError('Please enter valid username and password');
        setSubmission({isSubmitting: false, isSubmissionComplete: false});
      }
  }

    const handleSubmit = (e:any) => {
      e.preventDefault();

      if (state.password === state.confirmPassword) {
        setSubmission({isSubmitting: true, isSubmissionComplete: false});
        sendDetailsToServer();
      } else {
        props.showError('Passwords do not match');
      }
    };

    return (
      <React.Fragment>
        {!submissionState.isSubmissionComplete && 
          <div className="register">
              <div>
                  <span>Already have an account? </span>
                  <Link to='/login'>Login here</Link>
              </div>
              <div className="break"></div>
              <form>
                  <div>
                    <TextField
                        required
                        label="Email address"
                        name="email"
                        placeholder="Enter email"
                        className={classes.textField}
                        variant="outlined"
                      />
                  </div>
                  <div>
                    <TextField
                        required
                        type="password"
                        label="Email Password"
                        name="password"
                        placeholder="Enter password"
                        className={classes.textField}
                        variant="outlined"
                      />
                  </div>
                  <div>
                    <TextField
                        required
                        type="password"
                        label="Confirm Password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        className={classes.textField}
                        variant="outlined"
                      />
                  </div>
                  <button type="submit" disabled={submissionState.isSubmitting} onClick={handleSubmit}>Register</button>
              </form>
          </div>
        }
        {submissionState.isSubmissionComplete && 
          <div className="register">
            <h3>Thank you for your registration!</h3>
          </div>
        }
      </React.Fragment>
    );
};

export default withStyles(styles)(withRouter(Register));
