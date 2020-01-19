import React, { Component } from 'react';

import TopBar from './TopBar';
import Menu from './Menu';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menu: false,
        }
    }

    toggleMenu() {
        const menu = !this.state.menu;
        this.setState({ menu })
    }

    render() {
        return (
            <React.Fragment>
                <TopBar toggleMenu={this.toggleMenu.bind(this)} />
                <Menu open={this.state.menu} toggleMenu={this.toggleMenu.bind(this)}/>
            </React.Fragment>
        )
    }
}
