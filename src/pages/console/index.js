import React, {Component} from 'react';
import { Route, Link } from 'react-router-dom';
import TopNav from './header/TopNav';
import {Card} from "semantic-ui-react";

class Console extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <TopNav/>
            </div>
        );
    }
}

export default Console;