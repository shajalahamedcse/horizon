import React, { Fragment, Component } from "react";
import { Button, Modal, Form, Input } from "semantic-ui-react";
import Spinner from "../../header/Spinner";
import axios from "axios";

class KeyPairModal extends Component {
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

  downloadKeyFile = (rsaText, name) => {
    const element = document.createElement("a");
    const file = new Blob([rsaText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${name}.txt`;
    document.body.appendChild(element);
    element.click();
  }

  nameChange = (e, { value }) => {
    this.setState({ keyPairName: value });
    };

    formSubmit = () => {
        this.setState({ formLoading: true });
        const postData = {
            "keypair": {
                "name": this.state.keyPairName
            }
        }
        const scopedToken = localStorage.getItem("scopedToken");
        const header = {
          headers: {
            "X-Auth-Token": scopedToken
          }
        };
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = `http://103.248.13.91:8774/v2.1/os-keypairs`;
        axios.post(proxyurl + url, postData, header).then((response)=>{
            const newKeyPair = response.data.keypair;
            this.downloadKeyFile(newKeyPair.private_key, newKeyPair.name);
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
      <Modal.Header>{this.state.loading ? <h1>Creating Key Pair...</h1> : <h1>Create a new Key Pair </h1>}</Modal.Header>
        <Modal.Content>
            {this.state.loading ? <Spinner /> : (
                <div>
                <Form loading={ this.state.formLoading } onSubmit={this.formSubmit}>
                    <Form.Field control={Input} onChange={this.nameChange} label='Key Pair Name' placeholder='Enter a name for your KeyPair' />
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

export default KeyPairModal;
