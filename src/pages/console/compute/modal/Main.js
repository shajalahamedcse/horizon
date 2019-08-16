import React, { Component } from "react";
import { Button, Header, Image, Modal } from "semantic-ui-react";
import Modals from "./Modal";

class ModalExampleDimmer extends Component {
  state = { open: true };

  render() {
    return (
      <div>
        <Modals opens={this.state.open} />
      </div>
    );
  }
}

export default ModalExampleDimmer;
