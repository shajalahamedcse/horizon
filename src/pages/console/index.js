import React, { Fragment, Component } from "react";
import { Route, Link } from "react-router-dom";
import MenuBar from "./menu/Menu";
import TopNav from "./header/TopNav";
import Servers from "./compute/servers";
import Details from "./compute/Details";
import CreateInstance from "./compute/CreateInstance";
import { Button, Grid, GridColumn } from "semantic-ui-react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Modals from "./compute/modal/Modal";
import Keypairs from "./compute/keypairs/Keypairs";
import KeyDetails from "./compute/keypairs/KeyDetails";
import FloatingIP from "./compute/floatingip/FloatingIP";

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
          <Grid.Column stretched width={12}>
          <Switch>
            <Route
              exact
              path="/console/overview"
              render={props => (
                <Fragment>
                <Grid>
                  <Grid.Column width={8}> <h2>Instances</h2> </Grid.Column>
                  <Grid.Column width={8}> <Button
                          size="tiny"
                          onClick={this.updateStateOpen}
                          className="ui right floated button"
                        >
                          <p>Launch new Instance</p>
                      </Button>
                  </Grid.Column>
                  </Grid>
                  <div>
                  {
                    // <Link to="/console/overview/createinstance">
                    //   <Button className="positive ui button">
                    //     <p>Create Instance</p>
                    //   </Button>
                    // </Link>
              }
                    <hr/>
                    

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
                  
                  <Servers />
                </Fragment>
              )}
            />

            <Route
              path="/console/overview/details/:dynoName"
              component={Details}
            />

            <Route
              path="/console/overview/keypairs"
              component={Keypairs}
            />

            <Route
              path="/console/overview/keypairs/details/:keyId"
              component={KeyDetails}
            />

            <Route
              path="/console/overview/createinstance"
              component={CreateInstance}
            />

            <Route
              path="/console/overview/floatingip"
              component={FloatingIP}
            />

          </Switch>
          </Grid.Column>
          </Grid>
        </div>
      </Router>
    );
  }
}

export default Console;
