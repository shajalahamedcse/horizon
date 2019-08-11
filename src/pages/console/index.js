import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import TopNav from "./header/TopNav";
import Servers from "./compute/servers";
import { Card } from "semantic-ui-react";

class Console extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <TopNav />
        <Servers />
      </div>
    );
  }
}

export default Console;
