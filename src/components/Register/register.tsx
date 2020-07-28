import './register.css';
import axios from 'axios';
import React, { FunctionComponent, useState } from "react";
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { IDENTITY_CONFIG } from '../../utils/authConst';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


const styles = (theme: Theme) =>
  createStyles({
    textField: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    }
  });


type RegisterProps = {
  updateTitle: any
  showError: any
}

const Register: FunctionComponent<RegisterProps & RouteComponentProps & WithStyles<typeof styles>> = props => {
    const { classes, updateTitle } = props;

    const [state , setState] = useState({
      email : '',
      password : '',
      confirmPassword: ''
    });

    const [submissionState, setSubmission] = useState({isSubmitting: false, isSubmissionComplete: false});

    const handleChange = (e:any) => {
      const { id, value } = e.target;

      props.showError(null);

      setState(prevState => ({
        ...prevState,
        [id]: value
      }));
    };

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
                      props.showError(null);
                      setSubmission({isSubmitting: false, isSubmissionComplete: true});
                  } else {
                    Object.keys(response.data).forEach(key => {
                      props.showError(Reflect.get(response.data,key)[0]);
                    })

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

    updateTitle('User Registration');

    return (
      <React.Fragment>
        {!submissionState.isSubmissionComplete && 
          <div className="register">
              <div>
                  <span>{'Already have an account?'} </span>
                  <Link to='/login'>{'Login here'}</Link>
              </div>
              <div className="break" />
              <form>
                  <div>
                    <TextField
                        required
                        label="Email address"
                        name="email"
                        id="email"
                        placeholder="Enter email"
                        className={classes.textField}
                        variant="outlined"
                        onChange={handleChange}
                      />
                  </div>
                  <div>
                    <TextField
                        required
                        type="password"
                        label="Email Password"
                        name="password"
                        id="password"
                        placeholder="Enter password"
                        className={classes.textField}
                        variant="outlined"
                        onChange={handleChange}
                      />
                  </div>
                  <div>
                    <TextField
                        required
                        type="password"
                        label="Confirm Password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        className={classes.textField}
                        variant="outlined"
                        onChange={handleChange}
                      />
                  </div>
                  <Button variant="contained" color="primary" size="large" disabled={submissionState.isSubmitting} onClick={handleSubmit}>{'Register'}</Button>
              </form>
          </div>
        }
        {submissionState.isSubmissionComplete && 
          <div className="register">
            <h3>{'An activation link have been emailed to you, please click on the link in the email to complete the registration.'}</h3>
          </div>
        }
      </React.Fragment>
    );
};

export default withStyles(styles)(withRouter(Register));
