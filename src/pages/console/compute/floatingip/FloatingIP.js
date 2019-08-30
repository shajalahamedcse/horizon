import React, { Component } from "react";
import Spinner from "../../header/Spinner";
import { Link } from "react-router-dom";
import { Grid, Button, Form, Input } from "semantic-ui-react";
import CreateFloatingIP from "../modal/CreateFloatingIP";
import axios from "axios";

class FloatingIP extends Component {
  state = {
    floatingips: [],
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
    const url = "http://103.248.13.91:9696/v2.0/floatingips";
    const request = await axios.get(proxyurl + url, header);
    this.setState({ floatingips: request.data.floatingips, loading: false });
    console.log(this.state.floatingips);
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
              <h1>Floating IPs</h1>
            </Grid.Column>
            <Grid.Column width={6}>
            <Button
              size="tiny"
              onClick={this.openCreateKeyPair}
              className="ui right floated button"> <p>Create a Floating IP</p> </Button>
            </Grid.Column>
          </Grid>
          <hr />
            {this.state.modalOpen ? <CreateFloatingIP opens={this.state.modalOpen} modalClose={this.modalClose} keyName={this.state.keyName} /> : ''}
            {this.state.newKeyPairModal ? <CreateFloatingIP opens={this.state.newKeyPairModal} modalClose={this.modalClose} /> : ''}
          <div className="ui relaxed divided list">
            { this.state.floatingips.map(ip => (    
              <div key={ip.id} className="item">
            <Grid columns='equal'>
                <Grid.Column width={12}>
                <div className="content">
                <i className="large middle aligned" />
                <span><Link
                    to={`/console/overview/keypairs/details/${ip.id}`}
                    className="header"
                  >
                    {ip.floating_ip_address}
                  </Link> </span>
                  <div className="description">Project ID: {ip.project_id}</div>
                  <div className="status">Status: {ip.status}</div>
                  </div>
                </Grid.Column>
                <Grid.Column width={4}>
                    <div>
                    <Button name={ip.id} floated='right' size='mini' onClick={this.handleButtonClick} negative>Delete floating IP</Button>
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

export default FloatingIP;
