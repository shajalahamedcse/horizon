import React, { Component } from "react";
import { Button, Header, Image, Modal } from "semantic-ui-react";
import FormOne from "./FormOne";
import FormTwo from "./FormTwo";
import FormFinal from "./FormFinal";
import axios from "axios";

class Modals extends Component {
  instanceValues = {
    instanceName:"",
    flavorValue:"",
    netValue:"",
    volumeUUID:""
  };

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      values: {
        firstName: "hello"
      },
      step: 1
    };
  }

  componentDidMount() {
    this.setState({ open: this.props.opens });
  }

  show = dimmer => () => this.setState({ dimmer, open: true });
  close = () => {
    this.setState({ open: false, step: 1 });
    this.props.modalClose();
  };

  handleChangeInstance = input => {
    const { instanceName, flavorValue, netValue } = input;
    this.instanceValues.instanceName = instanceName;
    this.instanceValues.flavorValue = flavorValue;
    this.instanceValues.netValue = netValue;
    //this.setState({ instanceName, flavorValue, netValue });
 };

 handleChangeVolume = input => {
    const { volumeUUID } = input;
    this.instanceValues.volumeUUID = volumeUUID;
    //console.log(this.state);
    //this.setState({ volumeUUID });
 };

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  render() {
    const { open, dimmer } = this.state;
    const { step } = this.state;

    return (
      <div>
        <Modal dimmer={dimmer} open={open} onClose={this.close}>
          {step !== 3 ? <Modal.Header>Launch Instance</Modal.Header> : ""}
          <Modal.Content>
            { step === 1 && (
                    <FormOne
                    handleChange={this.handleChangeVolume}
                    values={this.state.values}
                    nextStep={this.nextStep}
                />
                ) }
                {step === 2 && (
                <FormTwo
                    handleChange={this.handleChangeInstance}
                    values={this.state.values}
                  />
                )}
                {step === 3 && (
                    <FormFinal instanceParams={this.instanceValues} closeModal={this.close} />
                )}
            
          </Modal.Content>
          <Modal.Actions>
            {step === 2 ? (<Button color="black" onClick={this.close}>
              Cancel
            </Button>) : ""}
            {step !== 2 ? "" : (<Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="Create Instance"
              onClick={this.nextStep}
            />) }
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default Modals;
