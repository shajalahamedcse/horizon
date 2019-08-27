import React, { Fragment, Component } from "react";
import { Button, Modal } from "semantic-ui-react";
import Spinner from "../../header/Spinner";
import axios from "axios";

class KeyPairModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      keyName: '',
      loading: false
    };
  }

  componentDidMount() {
    this.setState({ keyName: this.props.keyName, open: this.props.opens });
  }

  show = dimmer => () => this.setState({ dimmer, open: true });
  close = (e, attr) => {
        this.setState({ open: false });
        this.props.modalClose();
  };

  handleDelete = () => {
      this.setState({ loading: true });
      console.log(this.state.keyName + ' being deleted');
      
      const scopedToken = localStorage.getItem("scopedToken");
        const header = {
          headers: {
            "X-Auth-Token": scopedToken
          }
        };
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = `http://103.248.13.91:8774/v2.1/os-keypairs/${this.state.keyName}`;
        axios.delete(proxyurl + url, header).then((response)=>{
            this.setState({ open: false, loading : false });
            this.props.modalClose();
        }).catch((err)=> {
            console.log(err);
        });
  }


  render() {
    const { open, dimmer } = this.state;

    return (
      <div>
      <Modal open={open} onClose={this.close}>
      <Modal.Header>{this.state.loading ? <h1>Deleting Key Pair...</h1> : <h1>Delete Key Pair! </h1>}</Modal.Header>
        <Modal.Content>
            {this.state.loading ? <Spinner /> : <h2>Are you sure you want to delete this Key Pair? </h2>}
        </Modal.Content>
      <Modal.Actions>
      { this.state.loading ? '' : ( <Fragment> <Button color="black" onClick={this.close}>Cancel</Button> <Button color="red" onClick={this.handleDelete}>Delete</Button></Fragment> ) }
      </Modal.Actions>
      </Modal>
    />
      </div>
    );
  }
}

export default KeyPairModal;
