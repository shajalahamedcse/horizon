import React, { Fragment, Component } from "react";
import { Button, Modal, Form, Select } from "semantic-ui-react";
import Spinner from "../../header/Spinner";
import axios from "axios";

class AssociateFloatingIP extends Component {
    instancesList = [];
    portList = [];

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      isPortFetching: false,
      open: false,
      loading: false,
      formLoading: false,
      instances: [],
      instanceName: "",
      ports: [],
      portName: ""
    };
  }

  getNetworkPorts= (network_id) => {
      this.setState({isPortFetching: true });
    const scopedToken = localStorage.getItem("scopedToken");
    const header = {
      headers: {
        "X-Auth-Token": scopedToken
      }
    };
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `http://103.248.13.91:9696/v2.0/ports?network_id=${network_id}&device_owner=compute:nova`;
    axios.get(proxyurl + url, header).then((response)=> {
        const portData = response.data.ports;
        console.log(portData);
        portData.forEach(port => {
            this.portList.push({key: port.id, text: port['fixed_ips']['0'].ip_address, value: port.id });
        });

        this.setState({
            isPortFetching: false,
            ports: this.portList
        });
    }).catch(err=> {
        console.log(err);
    })
  }

  componentDidMount() {
    this.setState({ open: this.props.opens, keyName: this.props.keyName, isFetching: true, ipKey: this.props.keyName });
    const scopedToken = localStorage.getItem("scopedToken");
    const projectID = localStorage.getItem("projectID");
    const header = {
      headers: {
        "X-Auth-Token": scopedToken
      }
    };
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `http://103.248.13.91:9696/v2.0/networks?project_id=${projectID}`;
    axios.get(proxyurl + url, header).then((response)=> {
        const instanceData = response.data.networks;
        instanceData.forEach(instance => {
            this.instancesList.push({key: instance.id, text: instance.name, value: instance.id });
        });

        this.setState({
            isFetching: false,
            instances: this.instancesList
        });
    }).catch(err=> {
        console.log(err);
    })
  }

  show = dimmer => () => this.setState({ dimmer, open: true });
  close = (e, attr) => {
        this.setState({ open: false });
        this.props.modalClose();
  };

  instanceChange = (e, { value }) => {
      this.setState({ instanceName: value });
      this.getNetworkPorts(value);
      console.log(this.state.instanceName);
  }

  portChange = (e, { value }) => {
    this.setState({ portName: value });
    }

    formSubmit = () => {
        this.setState({ formLoading: true });
        const scopedToken = localStorage.getItem("scopedToken");
        const postData = {
            "floatingip": {
                "port_id": this.state.portName
            }
        }
        
        const header = {
          headers: {
            "X-Auth-Token": scopedToken
          }
        };
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = `http://103.248.13.91:9696/v2.0/floatingips/${this.state.keyName}`;
        axios.put(proxyurl + url, postData, header).then((response)=>{
            console.log(response.data);
            this.setState({ formLoading: false });
            this.close();
        }).catch((err)=> {
            console.log(err);
        });
    }


  render() {
    const { ports, instances, isFetching, isPortFetching, portName, instanceName, open } = this.state;

    return (
      <div>
      <Modal open={open} onClose={this.close}>
      <Modal.Header>{this.state.loading ? <h1>Assigning Floating IP...</h1> : <h1>Associate Floating IP </h1>}</Modal.Header>
        <Modal.Content>
            {this.state.loading ? <Spinner /> : (
                <div>
                <Form loading={ this.state.formLoading } onSubmit={this.formSubmit}>
                <Form.Field control={Select} selection onChange={this.instanceChange} loading={isFetching} disabled={isFetching} value={instanceName} label='Select Network' options={instances} placeholder='Select a Network' />
                <Form.Field control={Select} selection onChange={this.portChange} loading={isPortFetching} disabled={isPortFetching} value={portName} label='Select port' options={ports} placeholder='Select a port to Associate' />
                </Form>                
                </div>
            )}
        </Modal.Content>
      <Modal.Actions>
      { this.state.loading ? '' : ( <Fragment> <Button color="black" onClick={this.close}>Cancel</Button> <Button color="red" onClick={this.formSubmit}>Associate</Button></Fragment> ) }
      </Modal.Actions>
      </Modal>
    />
      </div>
    );
  }
}

export default AssociateFloatingIP;
