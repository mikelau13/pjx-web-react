import React, { FunctionComponent, useState } from "react";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import AuthService from '../../services/authService';
import CountryService from '../../services/countryService';
import Title from '../Header/title';

const styles = (theme: Theme) =>
  createStyles({
    table: {
      minWidth: 650,
    }
  }
);

export type CountryListProps = {}

const CountryList: FunctionComponent<CountryListProps & RouteComponentProps & WithStyles<typeof styles>> = (props) => {
    const authService = new AuthService();
    const countryService = new CountryService(authService);
    const { classes } = props;
    const [loadingState, setLoading] = useState({isLoading: false, isFetched: false, errorMsg: '', countryList: []});
    

    const fetchCountryList = () => {
      setLoading(prevState => ({...prevState, isLoading: true }));
      
      countryService.getCountryAll()
        .then(countryList => {
          setLoading(prevState => ({...prevState, countryList: countryList, isLoading: false, isFetched: true }));
        })
        .catch(error => {
          console.log(error);
          setLoading(prevState => ({...prevState, errorMsg: 'error message', isLoading: false, isFetched: true }));
        });
    }

    const renderCountryList = (countryList: any) => {
      return (
        <TableContainer component={Paper}>
        <Title title='Country List' />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>{'Row Number'}</TableCell>
              <TableCell align="right">{'Country Name'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countryList.map((country: string, index: number) => (
              <TableRow key={country}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="right">{country}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      );
    }

    if (!loadingState.isLoading && !loadingState.isFetched) fetchCountryList();

    return (
      <React.Fragment>
        {loadingState.isLoading &&
          <div>Loading... Please wait... </div>
        }
        {loadingState.isFetched && loadingState.errorMsg !== '' &&
          <div>{loadingState.errorMsg}</div>
        }
        {loadingState.isFetched && loadingState.errorMsg === '' &&
          renderCountryList(loadingState.countryList)
        }
      </React.Fragment>
    );
}

export default withStyles(styles)(withRouter(CountryList));
