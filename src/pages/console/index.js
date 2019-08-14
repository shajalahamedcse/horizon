import React, { Fragment, Component } from "react";
import { Route, Link } from "react-router-dom";
import TopNav from "./header/TopNav";
import Servers from "./compute/servers";
import Details from "./compute/Details";
import CreateInstance from "./compute/CreateInstance";
import { Button, Card } from "semantic-ui-react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

class Console extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div>
          <TopNav />
          <Switch>
            <Route
              exact
              path="/console/overview"
              render={props => (
                <Fragment>
                  <div>
                    <Link to="/console/overview/createinstance">
                      <Button className="positive ui button">
                        <p>Create Instance</p>
                      </Button>
                    </Link>
                  </div>
                  <hr />
                  <h2>Servers</h2>
                  <Servers />
                </Fragment>
              )}
            />

            <Route
              path="/console/overview/details/:dynoName"
              component={Details}
            />

            <Route
              path="/console/overview/createinstance"
              component={CreateInstance}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Console;
