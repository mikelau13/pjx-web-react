import React from "react";
import { AuthConsumer } from "../../providers/authProvider";

export const Callback = () => (
    <AuthConsumer>
        {({ signinRedirectCallback }) => {
            signinRedirectCallback();
            return <span>{'Loading... please wait...'}</span>;
        }}
    </AuthConsumer>
);
