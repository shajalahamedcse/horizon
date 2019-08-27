import React, { Component } from "react";
import Spinner from "../../header/Spinner";
import { Link } from "react-router-dom";
import { Grid, Button } from "semantic-ui-react";
import axios from "axios";

class Keypairs extends Component {
  state = {
    keypairs: [],
    loading: false
  };

  handleButtonClick = (e, data) => {
        console.log(data.name);
  }

  async componentDidMount() {
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
  render() {
    if (this.state.loading === true) return <Spinner />;
    else {
      return (
        <div className="container">
            <h1>Key Pairs</h1>
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
