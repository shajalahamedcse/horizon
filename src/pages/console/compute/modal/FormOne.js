import React, { Component } from "react";
import { Button, Checkbox, Form, Input, Radio, Select, TextArea } from "semantic-ui-react";
import axios from "axios";

class UserDetails extends Component {
    volumeTypes = [];
    images = [];
  
    state = {
      isFetching: false,
      formLoading: false,
      volumeName: "",
      imgValue: "",
      volumeSize: 1,
      volumeValue: "",
      imgOptions: [],
      volumeOptions: []
    };

    volumeChange = (e, { value }) => this.setState({ volumeValue: value });
    imgChange = (e, { value }) => this.setState({ imgValue: value });
    nameChange = (e, { value }) => this.setState({ volumeName: value });
    sizeChange = (e, { value }) => this.setState({ volumeSize: value });

  saveAndContinue = e => {
    e.preventDefault();
    this.setState({ formLoading: true });
    this.postVolumeReq();
  };

  checkVolumeStatus = (id) => {
    const scopedToken = localStorage.getItem("scopedToken");
    const projectId = localStorage.getItem("projectID");

    const header = {
      headers: {
        "X-Auth-Token": scopedToken
      }
    };

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `http://103.248.13.91:8776/v3/${projectId}/volumes/${id}`;
    axios.get(proxyurl + url, header).then((response)=>{
        const volumeData = response.data.volume;
        this.setState({ volumeUUID: volumeData.id });
        console.log(volumeData.status);
        if(volumeData.status !== "available") {
            setTimeout(this.checkVolumeStatus(id), 3000);
        }
        else {
            console.log('volume is available');
            this.setState({ formLoading: false });
            this.props.nextStep();
        }
        // return volumeData.status;
    }).catch((err)=> {
        console.log(err);
    });
  }


  postVolumeReq = () => {
    const postData = {
        "volume": {
            "size": this.state.volumeSize,
            "name": this.state.volumeName,
            "imageRef": this.state.imgValue,
            "volume_type": this.state.volumeValue
        }
    }
    const scopedToken = localStorage.getItem("scopedToken");
    const projectId = localStorage.getItem("projectID");

    const header = {
      headers: {
        "X-Auth-Token": scopedToken
      }
    };
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `http://103.248.13.91:8776/v3/${projectId}/volumes`;
    axios.post(proxyurl + url, postData, header).then((response)=>{
        const newVolume = response.data.volume;
        console.log(newVolume);
        this.checkVolumeStatus(newVolume.id);
        
    }).catch((err)=> {
        console.log(err);
    });
  }


  async componentDidMount() {
    this.setState({ isFetching: true });
    const scopedToken = localStorage.getItem("scopedToken");
    const projectId = localStorage.getItem("projectID");
    const header = {
      headers: {
        "X-Auth-Token": scopedToken
      }
    };
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const urlVolType = `http://103.248.13.91:8776/v2/${projectId}/types`;
    const urlImages = "http://103.248.13.91:9292/v2.0/images";

    axios.all([
        axios.get(proxyurl + urlVolType, header),
        axios.get(proxyurl + urlImages, header)
    ]).then(axios.spread((volTypeRes, imagesRes) => {
        const volumeTypeData = volTypeRes.data.volume_types;
        const imagesData = imagesRes.data.images;

        volumeTypeData.forEach(volume => {
            this.volumeTypes.push({ key: volume.name, text: volume.name, value: volume.id });
        });

        imagesData.forEach(image => {
            this.images.push({ key: image.name, text: image.name, value: image.id });
        });

        this.setState({
            isFetching: false,
            imgOptions: this.images,
            volumeOptions: this.volumeTypes
        });
    })).catch((err)=> {
        console.log(err);
    })
  }

  componentWillUnmount(){
      this.props.handleChange(this.state);
  }

  render() {
    const { values } = this.props;
    const { isFetching, imgValue, volumeValue, imgOptions, volumeOptions } = this.state;
    
    return (
      <Form loading={ this.state.formLoading } color="green">
        <h1 className="ui centered">Step 1: Create Volume</h1>
        <Form.Field control={Input} onChange={this.nameChange} label='Volume Name' placeholder='Name of the Volume' />        
        <Form.Input label='Size (in GiB)' onChange={this.sizeChange} placeholder='Volume Size' type='number' />
        <Form.Field control={Select} selection onChange={this.volumeChange} loading={isFetching} disabled={isFetching} value={volumeValue} label='Volume Type' options={volumeOptions} placeholder='Select a Volume Type' />
        <Form.Field control={Select} selection onChange={this.imgChange} loading={isFetching} disabled={isFetching} value={imgValue} label='Select Image' options={imgOptions} placeholder='Select an Image' />
        <Button className="positive" onClick={this.saveAndContinue}>Create Volume </Button>
      </Form>
    );
  }
}

export default UserDetails;
