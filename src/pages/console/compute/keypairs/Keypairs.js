import React, { Component } from "react";
import Spinner from "../../header/Spinner";
import { Link } from "react-router-dom";
import { Grid, Button, Form, Input } from "semantic-ui-react";
import KeyPairModal from "../modal/KeyPairModal";
import CreateKeyPair from "../modal/CreateKeyPair";
import axios from "axios";

class Keypairs extends Component {
  state = {
    keypairs: [],
    loading: false,
    modalOpen: false,
    newKeyPairModal: false,
    keyName: ''
  };

  handleButtonClick = (e, data) => {
      this.setState({keyName: data.name, modalOpen: true});
        console.log(data.name);
  }

  modalClose = () => {
      this.setState({modalOpen: false, newKeyPairModal: false });
      this.getKeyPairData();
  }

  openCreateKeyPair = () => {
    this.setState({ newKeyPairModal: true });
  }

  async getKeyPairData () {
    this.setState({ loading: true });
    const scopedToken = localStorage.getItem("scopedToken");
    const header = {
      headers: {
        "X-Auth-Token": scopedToken
      }
    };
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "http://103.248.13.91:8774/v2.1/os-keypairs";
    const request = await axios.get(proxyurl + url, header);
    this.setState({ keypairs: request.data.keypairs, loading: false });
  }

  componentDidMount() {
      this.getKeyPairData = this.getKeyPairData.bind(this);
    this.getKeyPairData();
  }
  render() {
    if (this.state.loading === true) return <Spinner />;
    else {
      return (
        <div className="container">
          <Grid>
            <Grid.Column width={10}>
              <h1>Key Pairs</h1>
            </Grid.Column>
            <Grid.Column width={6}>
            <Button
              size="tiny"
              onClick={this.openCreateKeyPair}
              className="ui right floated button"> <p>Create Key Pair</p> </Button>
            </Grid.Column>
          </Grid>
          <hr />
            {this.state.modalOpen ? <KeyPairModal opens={this.state.modalOpen} modalClose={this.modalClose} keyName={this.state.keyName} /> : ''}
            {this.state.newKeyPairModal ? <CreateKeyPair opens={this.state.newKeyPairModal} modalClose={this.modalClose} /> : ''}
          <div className="ui relaxed divided list">
            { this.state.keypairs.map(keypair => (    
              <div key={keypair['keypair'].name} className="item">
            <Grid columns='equal'>
                <Grid.Column width={12}>
                <div className="content">
                <i className="large key middle aligned icon" />
                <span><Link
                    to={`/console/overview/keypairs/details/${keypair['keypair'].name}`}
                    className="header"
                  >
                    {keypair['keypair'].name}
                  </Link> </span>
                  <div className="description">Fingerprint: {keypair['keypair'].fingerprint}</div>
                  </div>
                </Grid.Column>
                <Grid.Column width={4}>
                    <div>
                    <Button name={keypair['keypair'].name} floated='right' size='mini' onClick={this.handleButtonClick} negative>Delete KeyPair</Button>
                    </div>
                </Grid.Column>
            </Grid>
              </div>
            )) }
          </div>
        </div>
      );
    }
  }
}

export default Keypairs;
