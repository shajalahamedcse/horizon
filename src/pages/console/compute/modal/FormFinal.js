import React, { Component } from "react";
import Spinner from "../../header/Spinner";
import axios from "axios";

class FormFinal extends Component {

    componentDidMount(){
        const { instanceName, flavorValue, netValue, volumeUUID } = this.props.instanceParams;
        const postData = {
            "server": {
                "flavorRef": flavorValue,
                "name": instanceName,
                "block_device_mapping_v2": [{
                    "boot_index": "0",
                    "uuid": volumeUUID,
                    "source_type": "volume",
                    "destination_type": "volume",
                    "delete_on_termination": true
                }],
                "networks": [{
                    "uuid": netValue
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
            this.props.closeModal();
        }).catch((err)=> {
            console.log(err);
        });
    
        console.log(postData);
    
    }

  render() {
    return (
      <div>
          <h1>Launching Instance...</h1>
            <Spinner />
      </div>
    );
  }
}

export default FormFinal;
