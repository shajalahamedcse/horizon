import React, { Component } from "react";
import { Button, Checkbox, Form, Input, Radio, Select, TextArea } from "semantic-ui-react";
import axios from "axios";

class FormTwo extends Component {
  networks = [];
  flavors = [];

  state = {
    isFetching: false,
    formLoading: false,
    instanceName: "",
    netValue: "",
    flavorValue: "",
    netOptions: [],
    flavorOptions: []
  };

  flavorChange = (e, { value }) => {
      this.setState({ flavorValue: value });
  };
  netChange = (e, { value }) => {
      this.setState({ netValue: value });
  };
  nameChange = (e, { value }) => {
      this.setState({ instanceName: value });
  };

  formSubmit = () => {
    this.setState({ formLoading: true });
    const postData = {
        "server": {
            "flavorRef": this.state.flavorValue,
            "name": this.state.instanceName,
            "networks": [{
                "uuid": this.state.netValue
            }]
        }
    }
    const scopedToken = localStorage.getItem("scopedToken");
    const header = {
      headers: {
        "X-Auth-Token": scopedToken
      }
    };
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `http://103.248.13.91:8774/v2.1/servers`;
    axios.post(proxyurl + url, postData, header).then((response)=>{
        this.setState({ formLoading: false });
        const newInstance = response.data;
        console.log(newInstance);
    }).catch((err)=> {
        console.log(err);
    });

    console.log(postData);

}

  async componentDidMount() {
    this.setState({ isFetching: true });
    const scopedToken = localStorage.getItem("scopedToken");
    const header = {
      headers: {
        "X-Auth-Token": scopedToken
      }
    };
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const urlNetworks = `http://103.248.13.91:9696/v2.0/networks?shared=True`;
    const urlFlavors = "http://103.248.13.91:8774/v2.1/flavors";

    axios.all([
        axios.get(proxyurl + urlNetworks, header),
        axios.get(proxyurl + urlFlavors, header)
    ]).then(axios.spread((networksRes, flavorsRes) => {
        const networksData = networksRes.data.networks;
        const flavorsData = flavorsRes.data.flavors;
        
        networksData.forEach(net => {
            this.networks.push({ key: net.name, text: net.name, value: net.id });
        });

        flavorsData.forEach(flavor => {
            this.flavors.push({ key: flavor.name, text: flavor.name, value: flavor.id });
        });

        this.setState({
            isFetching: false,
            netOptions: this.networks,
            flavorOptions: this.flavors
        });
    })).catch((err)=> {
        console.log(err);
    })
  }

  componentWillUnmount(){
    this.props.handleChange(this.state);
  }  
  render() {
    const { isFetching, netOptions, flavorValue, netValue, flavorOptions } = this.state;
    return (
      <div>

        <Form loading={ this.state.formLoading } onSubmit={this.formSubmit}>
            <h1 className="ui centered">Step 2: Create Instance</h1>
            <Form.Field control={Input} onChange={this.nameChange} label='Instance Name' placeholder='Instance Name' />
            <Form.Field control={Select} selection onChange={this.flavorChange} loading={isFetching} value={flavorValue} disabled={isFetching} label='Select Flavour' options={flavorOptions} placeholder='Select a Flavour' />
            <Form.Field control={Select} selection onChange={this.netChange} loading={isFetching} value={netValue} disabled={isFetching} label='Select Network' options={netOptions} placeholder='Select a Network' />
      </Form>
      </div>
    );
  }
}

export default FormTwo;

