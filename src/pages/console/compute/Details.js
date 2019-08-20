import React, { Fragment, Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Spinner from "../header/Spinner";
import { Button, Grid, Dropdown, Confirm } from "semantic-ui-react";

class Details extends Component {
  state = {
    serverInfo: [],
    loading: false,
    confirmOpen: '',
    confirmType: '',
    confirmMessage: '',
    redirect: false
  };

  options = [
    { key: 'reboot', icon: 'redo', text: 'Reboot Instance', value: 'reboot' },
    { key: 'delete', icon: 'delete', text: 'Remove Instance', value: 'delete' },
  ]

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
      loading: false,
      serverId: request.data.servers["0"].id
    });
    console.log(this.state);
  }

  setInstanceAction = (e, { value }) => {
    if(value === 'reboot'){
      this.setState({
        confirmMessage: 'Are you sure you want to reboot the instance',
        confirmOpen: true,
        confirmType: 'reboot'
      });
    }
    else if(value === 'delete'){
      this.setState({
        confirmMessage: 'Are you sure you want to delete the instance',
        confirmOpen: true,
        confirmType: 'delete'
      });
    }
  }

  initiateReboot = () => {
    this.setState({ loading: true });
    const postData = {
        "reboot": {
            "type": "HARD"
        }
    }
    const scopedToken = localStorage.getItem("scopedToken");
    const serverId = this.state.serverId;

    const header = {
      headers: {
        "X-Auth-Token": scopedToken
      }
    };

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `http://103.248.13.91:8774/v2.1/servers/${serverId}/action`;
    axios.post(proxyurl + url, postData, header).then((response)=>{
        const responseData = response.data;
        this.setState({ loading: false });
        console.log(responseData);
        this.setRedirect();
    }).catch((err)=> {
        console.log(err);
    });
  }

  initiateDelete = () => {
    this.setState({ loading: true });

    const scopedToken = localStorage.getItem("scopedToken");
    const serverId = this.state.serverId;

    const header = {
      headers: {
        "X-Auth-Token": scopedToken
      }
    };

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `http://103.248.13.91:8774/v2.1/servers/${serverId}`;
    axios.delete(proxyurl + url, header).then((response)=>{
        const responseData = response.data;
        this.setState({ loading: false });
        console.log(responseData);
        this.setRedirect();
    }).catch((err)=> {
        console.log(err);
    });
  }

  handleConfirm = () => {
      this.setState({ confirmOpen: false, confirmType: '', confirmMessage: '' });
      if(this.state.confirmType === 'reboot'){
        this.initiateReboot();
      }
      else if(this.state.confirmType === 'delete'){
        this.initiateDelete();
      }
    }

  handleCancel = () => {
    this.setState({ confirmOpen: false, confirmType: '', confirmMessage: '' });
  }

  setRedirect = () => {
    this.setState({ redirect: true });
  }

  renderRedirect = () => {
    if(this.state.redirect) return <Redirect to="/console/overview" />;
  }

  render() {
    if (this.state.loading === true) return <Spinner />;
    else {
      return (
        <Fragment>
        <Grid>
        <Grid.Column width={12}>
        <div>
          {this.state.serverInfo.map(server => (
            <div key={server.id}>
              <h2>Instance Details of : {server.id}</h2>
              <p>Server Name: {server.name}</p>
              <p>Status: {server.status}</p>
              <p>Host: {server["OS-EXT-SRV-ATTR:host"]}</p>
              <p>Availability Zone: {server["OS-EXT-AZ:availability_zone"]}</p>
              <p>Instance Name: {server["OS-EXT-SRV-ATTR:instance_name"]}</p>
              <p>VM State: {server["OS-EXT-STS:vm_state"]}</p>
              <p>Launched At: {server["OS-SRV-USG:launched_at"]}</p>
              <p>Tenant Id: {server.tenant_id}</p>
              <p>Created At: {server.created}</p>
              <p>Updated At: {server.updated}</p>
              <p>Server IP: {Object.keys(server["addresses"]).map((key)=> server["addresses"][key]["0"].addr)}</p>
            </div>
          ))}
        </div>
        </Grid.Column>
        <Grid.Column width={4}>
            <div>
              <Button.Group color='teal'>
              <Button>Actions</Button>
              <Dropdown
                className='button icon'
                floating
                options={this.options}
                onChange={this.setInstanceAction}
              />
            </Button.Group>
            </div>
        </Grid.Column>
        </Grid>
        <Confirm open={this.state.confirmOpen} content={this.state.confirmMessage} onCancel={this.handleCancel} onConfirm={this.handleConfirm} />
        { this.renderRedirect() }
        </Fragment>
      );
    }
  }
}

export default Details;
