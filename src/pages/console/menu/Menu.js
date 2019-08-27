import React, { Component } from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { Link } from "react-router-dom";

export default class MenuExampleVerticalDropdown extends Component {
  state = { activeItem: '' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu secondary vertical>
        <Menu.Item
          name='account'
          active={activeItem === 'account'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='settings'
          active={activeItem === 'settings'}
          onClick={this.handleItemClick}
        />
        <Dropdown item text='Compute'>
          <Dropdown.Menu>
            <Dropdown.Item><Link to="/console/overview">Instances</Link></Dropdown.Item>
            <Dropdown.Item>Images</Dropdown.Item>
            <Dropdown.Item><Link to="/console/overview/keypairs">Key Pairs</Link></Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown item text='Volumes'>
          <Dropdown.Menu>
            <Dropdown.Item>Volumes</Dropdown.Item>
            <Dropdown.Item>Snapshots</Dropdown.Item>
            <Dropdown.Item>Groups</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown item text='Network'>
          <Dropdown.Menu>
            <Dropdown.Item>Network Topology</Dropdown.Item>
            <Dropdown.Item>Networks</Dropdown.Item>
            <Dropdown.Item>Routers</Dropdown.Item>
            <Dropdown.Item>Security Groups</Dropdown.Item>
            <Dropdown.Item>Load Balancers</Dropdown.Item>
            <Dropdown.Item>Floating IPs</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    )
  }
}