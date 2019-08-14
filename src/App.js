import React, { Fragment } from "react";
import UserLoginPage from "./pages/login/LogIn";
import { Route, Switch, Link } from "react-router-dom";
import Console from "./pages/console/index";
import KeyPair from "./pages/key/KeyPair";

function App() {
  return (
    <Switch>
      <Route
        exact
        path={"/"}
        render={props => (
          <Fragment>
            <div>
              <h1>Welcome to Brilliant Cloud</h1>
              <Link to="/login" className="btn">
                Login
              </Link>
            </div>
          </Fragment>
        )}
      />
      <Route exact path={"/login"} component={UserLoginPage} />
      <Route exact path={"/console/overview"} component={Console} />
      <Route exact path={"/console/key"} component={KeyPair}/>
    </Switch>
  );
}

export default App;
