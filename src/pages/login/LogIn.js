import React, {Component} from 'react';
import {Button, Container, Form, Grid, Header, Segment,Card} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import LogInApi from '../../api/authApi';
import { Redirect} from "react-router-dom";

class LogIn extends Component{

    constructor(props){
        super(props);

        this.state = {
            formLoading: false,
            email: '',
            password: '',
            error: false,
            errorMessage: '',
            loggedIn: false
        };

        this.handleChange = (event, {name,value}) =>{

            this.setState({
                [name]: value
            })
        };

        this.onFormSubmit = ()=>{
            const data = {
                email : this.state.email,
                password: this.state.password
            };
            //console.log(data);
            this.setState({formLoading: false});
            LogInApi.userLogin(data, this.formSubmitCallBack);
        };

        this.formSubmitCallBack = (apiResponse) =>{
            //console.log(apiResponse);
            this.setState({formLoading:false});
            if(apiResponse.error){
                console.log(apiResponse.error);
            }else{
                this.setState({loggedIn: true});
            }

        };

    }

    render(){
        const {email,password,error,errorMessage,loggedIn} = this.state ;
        return(
            loggedIn ?
                <Redirect to={"/console/overview"}/> :
                (
                    <Grid textAlign='center'  verticalAlign='middle'>
                        <Grid.Column style={{ maxWidth: 450 }}>

                        <Header as={"h1"} textAlign={"center"} color="blue" style={{paddingTop: 100}}>Login</Header>
                        {
                            error ?
                                <Segment inverted color='red' textAlign={"center"}>
                                    {errorMessage}
                                </Segment>
                                : null
                        }

                            <Form size={"large"} loading={this.state.formLoading} onSubmit={this.onFormSubmit}>
                                <Form.Input required label='Email' name={"email"} value={email}
                                            fluid
                                            icon="user"
                                            iconPosition='left'
                                            placeholder='Enter Your Email'
                                            onChange={this.handleChange} style={{width: 400}}/>
                                <Form.Input required type="password" label='Password' name={"password"} value={password}
                                            fluid
                                            icon="lock"
                                            iconPosition='left'
                                            placeholder="Enter Password" onChange={this.handleChange} style={{width: 400}}/>
                                <Button fluid color="blue">Login</Button>

                            </Form>

                        </Grid.Column>
                    </Grid>

        )
        );
    }
}

export default LogIn;
