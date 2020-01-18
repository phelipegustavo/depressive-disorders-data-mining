import React, { Component } from 'react';

import Drawer from '@material-ui/core/Drawer';

export default class Map extends Component {

    static defaultProps = {
        anchor: 'right',
        value: false
    }

    constructor(props) {
        super(props);
        this.state = {
            items: []
        }
    }

    toggleDrawer() {
        this.props.value = !this.props.value;
    }

    render() {
        return (
            <Drawer anchor={this.props.anchor} open={this.props.value} onClose={toggleDrawer}>
                { items }
            </Drawer>
        )
    }
}