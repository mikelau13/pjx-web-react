import React, { FunctionComponent, useState } from "react";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField
  } from '@material-ui/core';
  import AuthService from '../../services/authService';

const styles = (theme: Theme) =>
  createStyles({

  }
);

export type ProfileReadProps = {
    updateTitle: any
}

const ProfileRead: FunctionComponent<ProfileReadProps & RouteComponentProps & WithStyles<typeof styles>> = (props) => {
    const authService = new AuthService();
    const { updateTitle, ...rest } = props;
 
    const [values, setValues] = useState({
      firstName: 'Mike',
      lastName: 'Lau',
      email: 'mikelau13@hotmail.com',
      phone: '',
      state: 'Ontario',
      country: 'Canada'
    });

    const getUser = () => {
        console.log('started getUser');
        authService.getUser().then((user:any) => {
          console.log('getUser callback');
          if (user) {
            console.log('getUser');
            console.log(user);
          }
        });
      };
  
    const handleChange = (e:any) => {
        const { id, value } = e.target;
  
        setValues(prevState => ({
          ...prevState,
          [id]: value
        }));
      };

    props.updateTitle('My Profile');
    getUser();

    return (
        <Card
        {...rest}
      >
        <form
          autoComplete="off"
          noValidate
        >
          <CardHeader
            subheader="You can modify your personal information"
            title="Profile"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="First name"
                  margin="dense"
                  name="firstName"
                  onChange={handleChange}
                  required
                  value={values.firstName}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Last name"
                  margin="dense"
                  name="lastName"
                  onChange={handleChange}
                  required
                  value={values.lastName}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  margin="dense"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  margin="dense"
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={values.phone}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="contained"
            >
              Save details
            </Button>
          </CardActions>
        </form>
      </Card>
    );
}

export default withStyles(styles)(withRouter(ProfileRead));;
