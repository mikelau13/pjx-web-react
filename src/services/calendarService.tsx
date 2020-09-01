import axios from 'axios';
import AuthService from './authService';
import { stringify } from 'querystring';

export type EventApiProps = {
    id?: number,
    title: string,
    start: string,
    end?: string
};

export type EventApiResult = {
  eventId: number,
  title: string,
  start: string,
  end?: string
};

export default class CalendarService {
    authService: AuthService;
    accessToken?: string;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    private apiPost = (token: string, url: string, postObj: any):Promise<any> => {
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      };
  
      return axios.post(url, postObj, { headers })
        .then(result => {
          return Promise.resolve(result.data);
        }).catch(error => {
          if (error.response.status === 401) {
            return this.authService.renewToken()
              .then(renewedUser => {
                headers.Authorization = 'Bearer ' + renewedUser.access_token;
                return axios.post(url, postObj, { headers })
                .then(result => {
                  return Promise.resolve(result.data);
                }).catch(error => {
                  return Promise.reject(new Error('user is not logged in'));
                });
              })
            .catch(error => {
                return Promise.reject(error);
            });
          } else {
              return Promise.reject(error);
          }
        });
  }
	
	  private apiGet = (token: string, url: string, query_string: string):Promise<any> => {
        const headers = {
          contentType: 'application/json',
          Authorization: 'Bearer ' + token
        };
    
        return axios.get(`${url}?${query_string}`, { headers })
          .then(result => {
            return Promise.resolve(result.data);
          }).catch(error => {
            if (error.response.status === 401) {
              return this.authService.renewToken()
                .then(renewedUser => {
                  headers.Authorization = 'Bearer ' + renewedUser.access_token;
                  return axios.get(`${url}?${query_string}`, { headers })
                  .then(result => {
                    return Promise.resolve(result.data);
                  }).catch(error => {
                    return Promise.reject(new Error('user is not logged in'));
                  });
                })
              .catch(error => {
                  return Promise.reject(error);
              });
            } else {
                return Promise.reject(error);
            }
          });
    }

    readAllEvent = (postObj: any):Promise<any> => {
      return this.getAccessToken()
        .then(token => {
          return this.apiGet(token, `${process.env.REACT_APP_API_DOTNET_URL}/api/calendar/event/readall`, stringify(postObj))
        }).catch(error => {
          return Promise.reject(error);
        });
    }

    private getAccessToken = ():Promise<string> => {
      return this.authService.getUser()
        .then((user:any) => {
          if (user) {
            if (user.access_token) {
              return Promise.resolve(user.access_token);
            } else if (user) {
              return this.authService.renewToken().then(renewedUser => {
                return Promise.resolve(renewedUser.access_token);
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
    }

    eventCreate = (postObj: any):Promise<any> => {
      return this.getAccessToken()
        .then(token => {
          return this.apiPost(token, `${process.env.REACT_APP_API_DOTNET_URL}/api/calendar/event/create`, postObj)
        }).catch(error => {
          return Promise.reject(error);
        });
    }

    eventUpdate = (postObj: any):Promise<any> => {
      return this.getAccessToken()
        .then(token => {
          return this.apiPost(token, `${process.env.REACT_APP_API_DOTNET_URL}/api/calendar/event/update`, postObj)
        }).catch(error => {
          return Promise.reject(error);
        });
    }
}
