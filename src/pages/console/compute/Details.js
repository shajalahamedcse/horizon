import React, { Component } from "react";
import axios from "axios";
import Spinner from "../header/Spinner";

class Details extends Component {
  state = {
    serverInfo: [],
    loading: false
  };

  async componentDidMount() {
    const { dynoName } = this.props.match.params;
    this.setState({ loading: true });
    const scopedToken = localStorage.getItem("scopedToken");
    const header = {
      headers: {
        "X-Auth-Token": scopedToken
      }
    };
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `http://103.248.13.91:8774/v2.1/servers/detail?name=${dynoName}`;
    const request = await axios.get(proxyurl + url, header);
    this.setState({
      serverInfo: request.data.servers,
      loading: false
    });
    console.log(this.state.serverInfo);
  }
  render() {
    if (this.state.loading === true) return <Spinner />;
    else {
      return (
        <div>
          {this.state.serverInfo.map(server => (
            <div>
              <h2>Dyno Details of : {server.id}</h2>
              <p>Server Name: {server.name}</p>
              <p>Status: {server.status}</p>
              <p>Vcpus: {server.flavor.vcpus}</p>
              <p>Availability Zone: {server.availability_zone}</p>
              <p>Tenant Id: {server.tenant_id}</p>
              <p>Created At: {server.created}</p>
              <p>Updated At: {server.updated}</p>
            </div>
          ))}
        </div>
      );
    }
  }
}

export default Details;
