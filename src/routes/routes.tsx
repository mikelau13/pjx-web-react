import * as React from "react";
import { Route, Switch } from "react-router-dom";

import { Callback } from "../components/auth/callback";
import { Logout } from "../components/auth/logout";
import { LogoutCallback } from "../components/auth/logoutCallback";
import { PrivateRoute } from "./privateRoute";
import { SilentRenew } from "../components/auth/silentRenew";
import { Landing } from "../components/landing"
import { Dashboard } from "../components/dashboard";
import Cities from "../components/cities";


export const Routes = (
    <Switch>
        <Route exact={true} path="/signin-oidc" component={Callback} />
        <Route exact={true} path="/logout" component={Logout} />
        <Route exact={true} path="/logout/callback" component={LogoutCallback} />
        <Route exact={true} path="/silentrenew" component={SilentRenew} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/cities" component={Cities} />
        <Route path="/" component={Landing} /> 
    </Switch>
);
