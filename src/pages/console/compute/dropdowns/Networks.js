import React, { Component } from "react";
import { Button, Checkbox, Form, Input, Radio, Select, TextArea } from "semantic-ui-react";
import axios from "axios";

class Networks extends Component {
  networks = [];
  flavors = [];
  images = [];

  state = {
    isFetching: false,
    formLoading: false,
    instanceName: "",
    netValue: "",
    imgValue: "",
    flavorValue: "",
    netOptions: [],
    imgOptions: [],
    flavorOptions: []
  };

  flavorChange = (e, { value }) => this.setState({ flavorValue: value });
  imgChange = (e, { value }) => this.setState({ imgValue: value });
  netChange = (e, { value }) => this.setState({ netValue: value });
  nameChange = (e, { value }) => this.setState({ instanceName: value });

  formSubmit = () => {
    this.setState({ formLoading: true });
    const postData = {
        "server": {
            "flavorRef": this.state.flavorValue,
            "name": this.state.instanceName,
            "imageRef": this.state.imgValue,
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
    const urlImages = "http://103.248.13.91:9292/v2.0/images";

    axios.all([
        axios.get(proxyurl + urlNetworks, header),
        axios.get(proxyurl + urlFlavors, header),
        axios.get(proxyurl + urlImages, header)
    ]).then(axios.spread((networksRes, flavorsRes, imagesRes) => {
        const networksData = networksRes.data.networks;
        const flavorsData = flavorsRes.data.flavors;
        const imagesData = imagesRes.data.images;
        
        networksData.forEach(net => {
            this.networks.push({ key: net.name, text: net.name, value: net.id });
        });

        flavorsData.forEach(flavor => {
            this.flavors.push({ key: flavor.name, text: flavor.name, value: flavor.id });
        });

        imagesData.forEach(image => {
            this.images.push({ key: image.name, text: image.name, value: image.id });
        });

        this.setState({
            isFetching: false,
            netOptions: this.networks,
            imgOptions: this.images,
            flavorOptions: this.flavors
        });
    })).catch((err)=> {
        console.log(err);
    })
  }
  render() {
    const { isFetching, imgValue, netOptions, flavorValue, netValue, imgOptions, flavorOptions } = this.state;
    return (
      <div>

        <Form loading={ this.state.formLoading } onSubmit={this.formSubmit}>
            <Form.Field control={Input} onChange={this.nameChange} label='Instance Name' placeholder='Instance Name' />
            <Form.Field control={Select} selection onChange={this.flavorChange} loading={isFetching} disabled={isFetching} value={flavorValue} label='Select Flavour' options={flavorOptions} placeholder='Select a Flavour' />
            <Form.Field control={Select} selection onChange={this.imgChange} loading={isFetching} disabled={isFetching} value={imgValue} label='Select Image' options={imgOptions} placeholder='Select an Image' />
            <Form.Field control={Select} selection onChange={this.netChange} loading={isFetching} disabled={isFetching} value={netValue} label='Select Network' options={netOptions} placeholder='Select a Network' />
            <Form.Field control={Button}>Launch Instance</Form.Field>
      </Form>
      </div>
    );
  }
}

export default Networks;
