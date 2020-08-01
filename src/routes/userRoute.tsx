import React from 'react';
import { Route } from 'react-router-dom';
import { AuthConsumer } from '../providers/authProvider';

export const UserRoute = ({ component, ...rest }: any) => {
    const renderFn = (Component: any) => (props: any) => (
        <AuthConsumer>
            {({ getUser, signinRedirect }) => {
                var user = getUser();
                console.log('user');
                console.log(user);
                if (!!Component && user) {
                    return (
                        <div>
                            <Component {...props} />
                        </div>
                    );
                } else {
                    signinRedirect();
                    return <span>loading</span>;
                }
            }}
        </AuthConsumer>
    );

    return <Route {...rest} render={renderFn(component)} />;
};
