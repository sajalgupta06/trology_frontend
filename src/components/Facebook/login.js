import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import AWS from 'aws-sdk';
import { ResourceGroups } from 'aws-sdk';
import config from '../../config.json'
import {refreshAuthUser, authState, refreshUserSession, refreshAwsCredentials} from '../../utils/AuthUtil'
// To federated sign in from Facebook
class SignInWithFacebook extends Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
    }

    componentDidMount() {
        if (!window.FB) this.createScript();
    }

    signIn() {
        const fb = window.FB;
        fb.getLoginStatus(response => {
            console.log('===================response', response)
            if (response.status === 'connected') {
                this.getAWSCredentials(response.authResponse);
            } else {
                fb.login(
                    response => {
                        console.log('===============fb.login', response)
                        if (!response || !response.authResponse) {
                            return;
                        }
                        this.getAWSCredentials(response.authResponse);
                    },
                    {
                        // the authorized scopes
                        scope: 'public_profile,email'
                    }
                );
            }
        });
    }
    async test1(credentials) {
        AWS.config.credentials = credentials
        // await refreshAwsCredentials()
        this.props.redirectCallBack()
    }
    getAWSCredentials(response) {
        console.log('=================getAWSCredentials(response)', response)
            const { accessToken, expiresIn } = response;
            const date = new Date();
            const expires_at = expiresIn * 1000 + date.getTime();
            if (!accessToken) {
                return;
            }

            const fb = window.FB;
            fb.api('/me', { fields: 'name,email' }, response => {
                console.log('==========fb.api', response)
                const user = {
                    name: response.name,
                    email: response.email
                };

                Auth.federatedSignIn('facebook', { token: accessToken, expires_at }, user)
                .then(credentials => {
                    
                //     let  creds   = new AWS.Credentials( {
                //         accessKeyId: credentials.AccessKeyId,
                //         secretAccessKey: credentials.SecretKey,
                //         sessionToken: credentials.SessionToken
                //      });
    
                //   AWS.config.credentials = creds;
                //   authState.cognitoUser
                //   authState.accessKeyId = creds.accessKeyId;
                //   authState.secretAccessKey = creds.secretAccessKey;
                //   authState.sessionToken = creds.sessionToken;
                    // console.log('===========credentials', credentials);
                    // refreshAuthUser()
                    // authState.accessKeyId = credentials.accessKeyId;
                    // authState.secretAccessKey = credentials.secretAccessKey;
                    // authState.sessionToken = credentials.sessionToken;
                    // refreshUserSession()
                    this.test1(credentials)
                });
            });
        }

    createScript() {
        // load the sdk
        window.fbAsyncInit = this.fbAsyncInit;
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.onload = this.initFB;
        document.body.appendChild(script);
    }

    initFB() {
        const fb = window.FB;
        console.log('FB SDK initialized');
    }

    fbAsyncInit() {
        // init the fb sdk client
        const fb = window.FB;
        fb.init({
            appId   : config.social.FB,
            cookie  : true,
            xfbml   : true,
            version : 'v2.11'
        });
    }

    render() {
        return (
            <div style={{cursor:'pointer'}}  class="Forgot_padd">
                                <div onClick={this.signIn} href="#"><img src="images/fb.png" alt="" /></div>
                            </div>
            // <div>
            //     <button onClick={this.signIn}>Sign in with Facebook</button>
            // </div>
        );
    }
}
export default SignInWithFacebook