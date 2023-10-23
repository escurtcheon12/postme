import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import "./scss/style.scss";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedFrontboard from "./ProtectedFrontboard";
import { useSelector } from "react-redux";
import "./init_firebase_notification";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const ForgotPassword = React.lazy(() =>
  import("./views/pages/forgot_password/ForgotPassword")
);
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const App = () => {
  const auth = useSelector((store) => store.auth_reducer);
  return (
    <HashRouter>
      <React.Suspense fallback={loading}>
        <Switch>
          <Route
            exact
            path="/login"
            name="Login Page"
            render={(props) => (
              <ProtectedFrontboard auth={auth}>
                <Login {...props} />
              </ProtectedFrontboard>
            )}
          />
          <Route
            exact
            path="/register"
            name="Register Page"
            render={(props) => (
              <ProtectedFrontboard auth={auth}>
                <Register {...props} />
              </ProtectedFrontboard>
            )}
          />

          <Route
            exact
            path="/forgot-password"
            name="Forgot Password Page"
            render={(props) => <ForgotPassword {...props} />}
          />
          <Route
            exact
            path="/404"
            name="Page 404"
            render={(props) => <Page404 {...props} />}
          />
          <Route
            exact
            path="/500"
            name="Page 500"
            render={(props) => <Page500 {...props} />}
          />
          <Route
            path="/"
            name="Home"
            render={(props) => (
              <ProtectedRoute auth={auth}>
                <TheLayout {...props} />
              </ProtectedRoute>
            )}
          />
        </Switch>
      </React.Suspense>
    </HashRouter>
  );
};

// class App extends Component {

//   render() {

//   }
// }

export default App;
