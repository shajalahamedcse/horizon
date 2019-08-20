import React, { Fragment, Component } from "react";
import { Route, Link } from "react-router-dom";
import MenuBar from "./menu/Menu";
import TopNav from "./header/TopNav";
import Servers from "./compute/servers";
import Details from "./compute/Details";
import CreateInstance from "./compute/CreateInstance";
import { Button, Grid } from "semantic-ui-react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Modals from "./compute/modal/Modal";

class Console extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.updateStateOpen = this.updateStateOpen.bind(this);
  }

  updateStateOpen() {
    this.setState({ open: true });
  }

  modalClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <Router>
        <div>
          <TopNav />
          <Grid>
          <Grid.Column width={4}>
          <MenuBar />
          </Grid.Column>
          <Grid.Column stretched width={12}></Grid.Column>
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

                    <Button
                      onClick={this.updateStateOpen}
                      className="positive ui button"
                    >
                      <p>Launch Instance</p>
                    </Button>

                    {this.state.open ? (
                      <Modals
                        opens={this.state.open}
                        modalClose={this.modalClose}
                      />
                    ) : (
                      ""
                    )}
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
          </Grid>
        </div>
      </Router>
    );
  }
}

export default Console;
