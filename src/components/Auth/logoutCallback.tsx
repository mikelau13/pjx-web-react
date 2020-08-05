import React from "react";
import { AuthConsumer } from "../../providers/authProvider";

export const LogoutCallback = () => (
    <AuthConsumer>
        {({ signoutRedirectCallback }) => {
            signoutRedirectCallback();
            return <span>{'Loading... Please wait...'}</span>;
        }}
    </AuthConsumer>
);
