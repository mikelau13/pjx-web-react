# pjx-web-react

## Dependencies

This projet is a web client that depending on other projects, in order to launch the entire solution, please refer to instructions in [pjx-root](https://github.com/mikelau13/pjx-root).


## Libraries 

[oidc-client](https://github.com/IdentityModel/oidc-client-js/wiki) to connect to the [identity server](https://github.com/mikelau13/pjx-sso-identityserver).

TODO: configure challenge code.

[apollo-client](https://www.apollographql.com/docs/react/) to hook to the [apollo-server](https://github.com/mikelau13/pjx-graphql-apollo).



## Available Scripts

To launch the app in Docker container, run:

```bash
docker-compose up 
```

Alternatively, in the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

By clicking on the `dashboard` button, the page will forward you to the `pjx-sso-identityserver` to sign on; you can sign-on using username=`alice` password=`alice`


### `npm run build`

Builds the app for production to the `build` folder.

```bash
npm run build
```

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.



## Running bash commands from the container

Please run all bash(terminal) related commands from the `pjx-web-react-dev` container. This includes:

- Installing new npm modules
- Generating types
- Pretty much all the scripts commands in the package.json file

The one exception to this rule is the below command that will open an interactive terminal for the `pjx-web-react-dev` container. Once in this interactive terminal you can now run your commands the same as you would from your local terminal.

```bash
# run from your computer's terminal
npm run docker:exec
```

If successful you should see the following in your termianl:

```bash
# This is showing me logged in as root user.
root@2lsk39bd:/usr/app
```

By default your working directory should be `usr/app`, which is the root directory for the **nextjs** app. All commands should be run from here.

To exit the interactive terminal run the following:

```bash
exit
```
