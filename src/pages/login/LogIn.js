import React , {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Segment,Form,Grid,Header} from 'semantic-ui-react';
import login from './actions';


class LogIn extends Component{


    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: ""
        };
        this.validateForm = this.validateForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        console.log(this.state);
        login(this.state);
    };

    render() {
        return(
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='blue' textAlign='center'>
                        Log-in to your account
                    </Header>
                    <Form size='small'>
                        <Segment >
                            <Form.Input
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='E-mail address'
                                id='email'
                                onChange={this.handleChange}
                            />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                id='password'
                                onChange={this.handleChange}
                            />

                            <Button color='blue' fluid size='large' onClick={this.handleSubmit}>
                                Login
                            </Button>
                        </Segment>
                    </Form>

                </Grid.Column>
            </Grid>

        );
    }
}

export default LogIn;