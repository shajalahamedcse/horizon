import React, { Fragment } from "react";
import UserLoginPage from "./pages/login/LogIn";
import { Route, Switch, Link } from "react-router-dom";
import Console from "./pages/console/index";
import MenuBar from "./pages/console/menu/Menu";
import TopNav from "./pages/console/header/TopNav";
import { Grid } from "semantic-ui-react";

function App() {
  return (
    <Fragment>
    <TopNav />
      <Grid>
      <Grid.Column width={4}>
        <MenuBar />
      </Grid.Column>
      <Grid.Column stretched width={12}>
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
    </Switch>
    </Grid.Column>
    </Grid>
    
    </Fragment>
  );
}

export default App;
