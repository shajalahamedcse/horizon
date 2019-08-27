import React, { Component } from "react";
import Spinner from "../../header/Spinner";
import { Link } from "react-router-dom";
import { Grid, Button } from "semantic-ui-react";
import KeyPairModal from "../modal/KeyPairModal";
import axios from "axios";

class Keypairs extends Component {
  state = {
    keypairs: [],
    loading: false,
    modalOpen: false,
    keyName: ''
  };

  handleButtonClick = (e, data) => {
      this.setState({keyName: data.name, modalOpen: true});
        console.log(data.name);
  }

  modalClose = () => {
      this.setState({modalOpen: false});
      this.getKeyPairData();
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
    const url = "http://103.248.13.91:8774/v2.1//os-keypairs";
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
            <h1>Key Pairs</h1>
            {this.state.modalOpen ? <KeyPairModal opens={this.state.modalOpen} modalClose={this.modalClose} keyName={this.state.keyName} /> : ''}
          <div className="ui relaxed divided list">
            { this.state.keypairs.map(keypair => (    
              <div key={keypair['keypair'].name} className="item">
            <Grid columns='equal'>
                <Grid.Column width={8}>
                <i className="large key middle aligned icon" />
                <div className="content">
                  <Link
                    to={`/console/overview/keypairs/details/${keypair['keypair'].name}`}
                    className="header"
                  >
                    {keypair['keypair'].name}
                  </Link>
                  <div className="description">Fingerprint: {keypair['keypair'].fingerprint}</div>
                  </div>
                </Grid.Column>
                <Grid.Column>
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
