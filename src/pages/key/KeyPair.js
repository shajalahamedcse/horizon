import React,{Component} from 'react';
import axios from "axios";
import { Button, Modal,Input } from 'semantic-ui-react';

class KeyPair extends Component{
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            name:'' // Key-Par name
        };

        this.createKeyPair= this.createKeyPair.bind(this);

        this.show = size => () => this.setState({ size, open: true });

        this.close = () => this.setState({ open: false });

        this.handleChange = (event, {name,value}) =>{
            console.log(value);
            this.setState({
                name : value
            })
        };


    }


    createKeyPair(){
        const scopedToken = localStorage.getItem("scopedToken");
        const header = {
            headers: {
                "X-Auth-Token": scopedToken
            }
        };
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = "http://103.248.13.91:8774/v2.1/os-keypairs";
        const data = {
            "keypair":{
                "name":this.state.name
            }
        };
        console.log(data);
        const response =  axios.post(proxyurl + url, data,header);
        console.log(response);
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
       const url = "http://103.248.13.91:8774/v2.1/os-keypairs";
       const response = await axios.get(proxyurl + url, header);
       console.log(response);
       this.setState({ servers: response.data.servers, loading: false });
    }


    render() {
        const { open, size } = this.state;

        return (
            <div>
                <Button onClick={this.show('small')}>Key</Button>

                <Modal size={size} open={open} onClose={this.close}>
                    <Modal.Header>Create Key Pair</Modal.Header>
                    <Modal.Content>
                        <Input focus size='large' placeholder='Enter Key Pair Name' onChange={this.handleChange}/>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.close}>Cancel</Button>
                        <Button positive icon='checkmark' labelPosition='right' content='Create' onClick={this.createKeyPair}/>
                    </Modal.Actions>
                </Modal>
            </div>)
    }
}

export default KeyPair;