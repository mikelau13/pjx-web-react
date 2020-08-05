import React from "react";
import { AuthConsumer } from "../../providers/authProvider";

export const Logout = () => (
    <AuthConsumer>
        {({ logout }) => {
            logout();
            return <span>{'Loading... Please wait...'}</span>;
        }}
    </AuthConsumer>
);
