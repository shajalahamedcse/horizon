import React, { Fragment, Component } from "react";
import { Button, Modal, Form, Input } from "semantic-ui-react";
import Spinner from "../../header/Spinner";
import axios from "axios";

class CreateFloatingIP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loading: false,
      formLoading: false
    };
  }

  componentDidMount() {
    this.setState({ open: this.props.opens });
  }

  show = dimmer => () => this.setState({ dimmer, open: true });
  close = (e, attr) => {
        this.setState({ open: false });
        this.props.modalClose();
  };


  nameChange = (e, { value }) => {
    this.setState({ keyPairName: value });
    };

    formSubmit = () => {
        this.setState({ formLoading: true });
        const scopedToken = localStorage.getItem("scopedToken");
        const tenantId = localStorage.getItem("projectID");
        const postData = {
            "floatingip": {
                "tenant_id": tenantId,
                "project_id": tenantId,
                "floating_network_id": "6eaa091d-a955-48cf-9b65-82c5955dc585"
            }
        }
        
        const header = {
          headers: {
            "X-Auth-Token": scopedToken
          }
        };
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = `http://103.248.13.91:9696/v2.0/floatingips`;
        axios.post(proxyurl + url, postData, header).then((response)=>{
            console.log(response.data);
            this.setState({ formLoading: false });
            this.close();
        }).catch((err)=> {
            console.log(err);
        });
    }


  render() {
    const { open } = this.state;

    return (
      <div>
      <Modal open={open} onClose={this.close}>
      <Modal.Header>{this.state.loading ? <h1>Creating new Floating IP...</h1> : <h1>Create a new Floating IP </h1>}</Modal.Header>
        <Modal.Content>
            {this.state.loading ? <Spinner /> : (
                <div>
                <Form loading={ this.state.formLoading } onSubmit={this.formSubmit}>
                    <Form.Field control={Input} onChange={this.nameChange} label='Network Name' placeholder='Enter a Network ID' />
                </Form>                
                </div>
            )}
        </Modal.Content>
      <Modal.Actions>
      { this.state.loading ? '' : ( <Fragment> <Button color="black" onClick={this.close}>Cancel</Button> <Button color="red" onClick={this.formSubmit}>Create</Button></Fragment> ) }
      </Modal.Actions>
      </Modal>
    />
      </div>
    );
  }
}

export default CreateFloatingIP;
