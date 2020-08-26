import axios from 'axios';
import AuthService from './authService';

export default class CalendarService {
    authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    private _callApi = (token: string, postObj: any):Promise<any> => {
        const headers = {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token
        };
    
        return axios.post(`${process.env.REACT_APP_API_DOTNET_URL}/api/calendar/event/create`, postObj, { headers });
    }

    eventCreate(postObj: any): Promise<any> {
        return this.authService.getUser()
        .then((user:any) => {
          if (user) {
            if (user.access_token) {
              return this._callApi(user.access_token, postObj)
              .then(result => {
                return Promise.resolve(result.data);
              }).catch(error => {
                if (error.response.status === 401) {
                    return this.authService.renewToken()
                    .then(renewedUser => {
                        return this._callApi(renewedUser.access_token, postObj);
                    })
                    .catch(error => {
                        return Promise.reject(error);
                    });
                } else {
                    return Promise.reject(error);
                }
              });
            } else if (user) {
              return this.authService.renewToken().then(renewedUser => {
                return this._callApi(renewedUser.access_token, postObj);
              });
            } else {
              return Promise.reject(new Error('user is not logged in'));
            }
          } else {
            return Promise.reject(new Error('no renewedUser'));
          }
        })
        .catch(error => {
            return Promise.reject(error);
        });
    };
}
