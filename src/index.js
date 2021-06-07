import React from 'react';
import ReactDOM from 'react-dom';
import LogRocket from "logrocket";
import { Router } from 'react-router'
import Amplify from 'aws-amplify'
import { Provider } from 'react-redux'
import { ToastProvider, useToasts } from 'react-toast-notifications'
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/bootstrap.css';
import './fonts/css/all.css';
import './index.scss';
import { store } from './store'
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import { history } from './helpers'
import { LayoutProvider } from "./context/LayoutContext";
import { UserProvider } from "./context/UserContext";
import config from './config.json';
const {
  cognito: cognitoConfig,
  region
} = config.aws;
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: region,
    userPoolId: cognitoConfig.userPoolId,
    identityPoolId: cognitoConfig.identityPoolId,
    userPoolWebClientId: cognitoConfig.userPoolWebClientId,
  }
});
LogRocket.init(config.logRocketKey);
ReactDOM.render(
    <ToastProvider styles={{
      container: (provided) => ({ ...provided, zIndex: 99999 })
    }}>
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
         </Provider>
    </ToastProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
