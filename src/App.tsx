import React, { useState } from "react";
import { AuthProvider } from "./providers/authProvider";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Title from './components/Header/title';
import ErrorModal from './components/Alert/errorModal';  

import { Callback } from "./components/auth/callback";
import { Logout } from "./components/auth/logout";
import { LogoutCallback } from "./components/auth/logoutCallback";
import { PrivateRoute } from "./routes/privateRoute";
import { SilentRenew } from "./components/auth/silentRenew";
import { Landing } from "./components/landing"
import { Dashboard } from "./components/Dashboard/dashboard";
import Register from "./components/Register/register";
import Cities from "./components/cities";

function App() {
    const [title, updateTitle] = useState(null);
    const [errorMessage, updateErrorMessage] = useState(null);
    return (
        <AuthProvider>
            <BrowserRouter>
            <div className="App">
                <Title title={title}/>
                <div className="container d-flex align-items-center flex-column">
                    <Switch>
                        <Route path="/register">
                            <Register showError={updateErrorMessage} updateTitle={updateTitle}/>
                        </Route>
                        <Route exact={true} path="/signin-oidc" component={Callback} />
                        <Route exact={true} path="/logout" component={Logout} />
                        <Route exact={true} path="/logout/callback" component={LogoutCallback} />
                        <Route exact={true} path="/silentrenew" component={SilentRenew} />
                        <PrivateRoute path="/dashboard" component={Dashboard} />
                        <PrivateRoute path="/cities" component={Cities} />
                        <Route path="/" component={Landing} /> 
                    </Switch>
                    <ErrorModal errorMessage={errorMessage} hideError={updateErrorMessage}/>
                </div>
            </div>
            </BrowserRouter>
        </AuthProvider>
    );
  }
  
  export default App;
