import React, { Component } from "react";
import Spinner from "../header/Spinner";
import { Link } from "react-router-dom";
import axios from "axios";

class Servers extends Component {
  state = {
    servers: [],
    loading: false
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const scopedToken = localStorage.getItem("scopedToken");
    const header = {
      headers: {
        "X-Auth-Token": scopedToken
      }
    };
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "http://103.248.13.91:8774/v2.1/servers";
    const request = await axios.get(proxyurl + url, header);
    this.setState({ servers: request.data.servers, loading: false });
  }
  render() {
    if (this.state.loading === true) return <Spinner />;
    else {
      return (
        <div className="container">
          <div className="ui relaxed divided list">
            {this.state.servers.map(server => (
              <div key="{server.id}" className="item">
                <i className="large server middle aligned icon" />
                <div className="content">
                  <Link
                    to={`/console/overview/details/${server.name}`}
                    className="header"
                  >
                    {server.name}
                  </Link>
                  <div className="description">Server Id: {server.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
}

export default Servers;
