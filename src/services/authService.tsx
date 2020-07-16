import { IDENTITY_CONFIG, METADATA_OIDC } from "../utils/authConst";
import { UserManager, WebStorageStateStore, Log } from "oidc-client";

export default class AuthService {
    UserManager: UserManager;
    issuer_url?: string
    public_url?: string
    client_id?: string

    constructor() {
        this.UserManager = new UserManager({
            ...IDENTITY_CONFIG,
            userStore: new WebStorageStateStore({ store: window.sessionStorage }),
            metadata: {
                ...METADATA_OIDC
            }
        });

        this.issuer_url = IDENTITY_CONFIG.authority;
        this.client_id = IDENTITY_CONFIG.client_id;

        Log.logger = console;
        Log.level = Log.DEBUG;

        this.UserManager.events.addUserLoaded((user) => {
            if (window.location.href.indexOf("signin-oidc") !== -1) {
                this.navigateToScreen();
            }
        });
        this.UserManager.events.addSilentRenewError((e) => {
            console.log("silent renew error", e.message);
        });

        this.UserManager.events.addAccessTokenExpired(() => {
            console.log("token expired");
            this.signinSilent();
        });
    }

    signinRedirectCallback = () => {
        this.UserManager.signinRedirectCallback().then((user) => {
            console.log('signinRedirectCallback');
            console.log(user);
        });
    };

    getUser = async () => {
        const user = await this.UserManager.getUser();
        if (!user) {
            return await this.UserManager.signinRedirectCallback();
        }
        return user;
    };

    parseJwt = (token:string) => {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    };

    signinRedirect = () => {
        localStorage.setItem("redirectUri", window.location.pathname);
        this.UserManager.signinRedirect({});
    };

    navigateToScreen = () => {
        window.location.replace("/dashboard");
    };

    isAuthenticated = () => {
        console.log('isAuthenticated');
        const oidcStorage = JSON.parse(sessionStorage.getItem(`oidc.user:${process.env.REACT_APP_SSO_ISSUER_URL}:${process.env.REACT_APP_SSO_CLIENT_ID}`) ?? '{}')
        console.log(oidcStorage);
        console.log(`oidcStorage = ${(!!oidcStorage && !!oidcStorage.access_token)}`);
        return (!!oidcStorage && !!oidcStorage.access_token);
    };

    signinSilent = () => {
        this.UserManager.signinSilent()
            .then((user) => {
                console.log("signed in", user);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    signinSilentCallback = () => {
        this.UserManager.signinSilentCallback();
    };

    createSigninRequest = () => {
        return this.UserManager.createSigninRequest();
    };

    logout = () => {
        this.UserManager.signoutRedirect({
            id_token_hint: localStorage.getItem("id_token")
        });
        this.UserManager.clearStaleState();
    };

    signoutRedirectCallback = () => {
        this.UserManager.signoutRedirectCallback().then(() => {
            localStorage.clear();
            window.location.replace(process.env.REACT_APP_PUBLIC_URL ?? '/');
        });
        this.UserManager.clearStaleState();
    };
}
