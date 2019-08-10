import React , {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
class TopNav extends Component{
    state = {};

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state;

        return (
            <Menu stackable inverted >
                <Menu.Item>
                    Brilliant Cloud
                </Menu.Item>

                <Menu.Item
                    color='blue'
                    name='features'
                    active={activeItem === 'features'}
                    onClick={this.handleItemClick}
                >
                    Console
                </Menu.Item>


                <Menu.Item
                    name='logout'
                    color='blue'
                    position='right'
                    active={activeItem === 'logout'}
                    onClick={this.handleItemClick}>
                    Log Out
                </Menu.Item>
            </Menu>
        )
    }
}

export default TopNav;